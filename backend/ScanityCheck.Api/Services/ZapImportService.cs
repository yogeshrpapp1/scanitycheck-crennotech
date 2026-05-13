using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Helpers;
using ScanityCheck.Api.Models;
using ScanityCheck.Api.Models.Zap;

namespace ScanityCheck.Api.Services;

public class ZapImportService : IZapImportService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ZapImportService> _logger;

    public ZapImportService(AppDbContext context, ILogger<ZapImportService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<int> ImportFromJsonAsync(int scanJobId, string jsonFilePath)
    {
        var scanJob = await _context.ScanJobs
            .Include(x => x.Target)
            .FirstOrDefaultAsync(x => x.Id == scanJobId);

        if (scanJob == null)
            throw new Exception("Scan job not found.");

        if (!File.Exists(jsonFilePath))
            throw new Exception("JSON file not found.");

        var json = await File.ReadAllTextAsync(jsonFilePath);

        var zapReport = JsonSerializer.Deserialize<ZapReport>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        if (zapReport == null || zapReport.Site.Count == 0)
            throw new Exception("Invalid ZAP report.");

        if (zapReport.Site == null || !zapReport.Site.SelectMany(s => s.Alerts ?? new List<ZapAlert>()).Any())
        {
            throw new Exception("No alerts found in ZAP report.");
        }

        var existingFindings = await _context.Findings
            .Where(f => f.ScanJobId == scanJobId && f.SourceTool == "ZAP")
            .Include(f => f.EvidenceLogs)
            .ToListAsync();

        if (existingFindings.Any())
        {
            _context.EvidenceLogs.RemoveRange(existingFindings.SelectMany(f => f.EvidenceLogs));
            _context.Findings.RemoveRange(existingFindings);
            await _context.SaveChangesAsync();
        }

        int importedRows = 0;

        foreach (var site in zapReport.Site.Where(s => s.Alerts != null))
        {
            foreach (var alert in site.Alerts)
            {
                var instances = alert.Instances ?? new List<ZapInstance>();

                if (!instances.Any())
                {
                    var endpoint = site.Name ?? "";
                    var normalized = FindingNormalizationHelper.NormalizeEndpoint(endpoint);

                    _context.Findings.Add(new Finding
                    {
                        ScanJobId = scanJobId,
                        Title = alert.Alert ?? alert.Name ?? "Unknown Alert",
                        Description = alert.Desc ?? "",
                        Severity = SeverityHelper.FromZapRiskCode(alert.RiskCode),
                        Endpoint = endpoint,
                        NormalizedEndpoint = normalized,
                        Recommendation = alert.Solution ?? "",
                        SourceTool = "ZAP",
                        Category = "ZAP Alert",
                        CweId = NormalizeId(alert.CweId),
                        WascId = NormalizeId(alert.WascId),
                        AlertRef = alert.AlertRef,
                        Confidence = alert.Confidence,
                        RiskDescription = alert.RiskDesc,
                        CreatedAt = DateTime.UtcNow
                    });

                    importedRows++;
                    continue;
                }

                foreach (var instance in instances)
                {
                    var endpoint = instance.Uri ?? site.Name ?? "";
                    var normalized = FindingNormalizationHelper.NormalizeEndpoint(endpoint);

                    _context.Findings.Add(new Finding
                    {
                        ScanJobId = scanJobId,
                        Title = alert.Alert ?? alert.Name ?? "Unknown Alert",
                        Description = alert.Desc ?? "",
                        Severity = SeverityHelper.FromZapRiskCode(alert.RiskCode),
                        Endpoint = endpoint,
                        NormalizedEndpoint = normalized,
                        Recommendation = alert.Solution ?? "",
                        SourceTool = "ZAP",
                        Category = "ZAP Alert",
                        CweId = NormalizeId(alert.CweId),
                        WascId = NormalizeId(alert.WascId),
                        AlertRef = alert.AlertRef,
                        Confidence = alert.Confidence,
                        RiskDescription = alert.RiskDesc,
                        CreatedAt = DateTime.UtcNow,
                        EvidenceLogs = new List<EvidenceLog>
                        {
                            new EvidenceLog
                            {
                                RequestData = $"{instance.Method} {instance.Uri}",
                                ResponseData = null,
                                Notes = alert.OtherInfo,
                                HttpMethod = instance.Method,
                                Parameter = instance.Param,
                                Attack = instance.Attack,
                                Evidence = instance.Evidence,
                                OtherInfo = instance.OtherInfo,
                                CreatedAt = DateTime.UtcNow
                            }
                        }
                    });

                    importedRows++;
                }
            }
        }

        var newFindings = _context.Findings.Local
            .Where(f => f.ScanJobId == scanJobId)
            .ToList();

        scanJob.Status = ScanStatus.Completed;
        scanJob.CompletedAt = DateTime.UtcNow;
        scanJob.Summary = ScanSummaryHelper.BuildSummary(newFindings, importedRows, 0);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Imported {ImportedRows} rows for scan job {ScanJobId}", importedRows, scanJobId);

        return importedRows;
    }

    private static string? NormalizeId(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || value == "-1" || value == "0")
            return null;

        return value;
    }
}