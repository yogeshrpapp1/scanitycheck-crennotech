using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Helpers;
using ScanityCheck.Api.Models;
using ScanityCheck.Api.Models.Nuclei;

namespace ScanityCheck.Api.Services;

public class NucleiImportService : INucleiImportService
{
    private readonly AppDbContext _context;
    private readonly ILogger<NucleiImportService> _logger;

    public NucleiImportService(AppDbContext context, ILogger<NucleiImportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> ImportFromJsonLinesAsync(int scanJobId, string jsonlFilePath)
    {
        if (!File.Exists(jsonlFilePath))
            throw new Exception($"Nuclei JSONL file not found: {jsonlFilePath}");

        var existingFindings = await _context.Findings
            .Where(x => x.ScanJobId == scanJobId)
            .ToListAsync();

        var lines = await File.ReadAllLinesAsync(jsonlFilePath);

        int importedRows = 0;

        foreach (var line in lines.Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            NucleiResult? result;

            try
            {
                result = JsonSerializer.Deserialize<NucleiResult>(line, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
            }
            catch
            {
                continue;
            }

            if (result == null)
                continue;

            var endpoint = result.MatchedAt ?? result.Host ?? "";
            var normalizedEndpoint = FindingNormalizationHelper.NormalizeEndpoint(endpoint);
            var cweId = result.Info?.Classification?.CweId?.FirstOrDefault();
            var cveId = result.Info?.Classification?.CveId?.FirstOrDefault();

            var finding = new Finding
            {
                ScanJobId = scanJobId,
                Title = result.Info?.Name ?? result.TemplateId ?? "Nuclei Finding",
                Description = result.Info?.Description ?? "",
                Severity = MapSeverity(result.Info?.Severity),
                Endpoint = endpoint,
                NormalizedEndpoint = normalizedEndpoint,
                Recommendation = BuildRecommendation(result),
                SourceTool = "Nuclei",
                Category = result.TemplateId ?? "Nuclei Template",
                CweId = NormalizeId(cweId),
                WascId = null,
                AlertRef = result.TemplateId,
                Confidence = null,
                RiskDescription = result.Info?.Severity,
                CreatedAt = DateTime.UtcNow,
                EvidenceLogs = new List<EvidenceLog>
                {
                    new EvidenceLog
                    {
                        RequestData = result.CurlCommand,
                        ResponseData = null,
                        Notes = BuildNotes(result, cveId),
                        HttpMethod = result.Type,
                        Parameter = result.MatcherName,
                        Attack = result.TemplateId,
                        Evidence = result.ExtractedResults != null
                            ? string.Join(" | ", result.ExtractedResults)
                            : "",
                        OtherInfo = line,
                        CreatedAt = DateTime.UtcNow
                    }
                }
            };

            if (FindingDeduplicationHelper.IsDuplicate(existingFindings, finding))
                continue;

            _context.Findings.Add(finding);
            existingFindings.Add(finding);
            importedRows++;
        }

        await _context.SaveChangesAsync();
        return importedRows;
    }

    private static SeverityLevel MapSeverity(string? severity)
    {
        return severity?.ToLowerInvariant() switch
        {
            "critical" => SeverityLevel.Critical,
            "high" => SeverityLevel.High,
            "medium" => SeverityLevel.Medium,
            "low" => SeverityLevel.Low,
            _ => SeverityLevel.Info
        };
    }

    private static string BuildRecommendation(NucleiResult result)
    {
        if (result.Info?.Reference == null || result.Info.Reference.Count == 0)
            return "Review the matched Nuclei template and remediate according to the affected technology or configuration.";

        return "Review references: " + string.Join(", ", result.Info.Reference);
    }

    private static string BuildNotes(NucleiResult result, string? cveId)
    {
        var tags = result.Info?.Tags != null ? string.Join(", ", result.Info.Tags) : "";
        var cve = string.IsNullOrWhiteSpace(cveId) ? "" : $"CVE: {cveId}. ";

        return $"{cve}Template: {result.TemplateId}. Tags: {tags}";
    }

    private static string? NormalizeId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || value == "-1" || value == "0")
            return null;

        return value;
    }
}