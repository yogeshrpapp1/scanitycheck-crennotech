using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Helpers;

namespace ScanityCheck.Api.Services;

public class ScanExecutionService : IScanExecutionService
{
    private readonly AppDbContext _context;
    private readonly IZapRunnerService _zapRunnerService;
    private readonly IZapImportService _zapImportService;
    private readonly ILogger<ScanExecutionService> _logger;

    public ScanExecutionService(
        AppDbContext context,
        IZapRunnerService zapRunnerService,
        IZapImportService zapImportService,
        ILogger<ScanExecutionService> logger)
    {
        _context = context;
        _zapRunnerService = zapRunnerService;
        _zapImportService = zapImportService;
        _logger = logger;
    }

    public async Task ExecuteZapScanAsync(int scanJobId)
    {
        var scanJob = await _context.ScanJobs
            .Include(x => x.Target)
            .FirstOrDefaultAsync(x => x.Id == scanJobId);

        if (scanJob == null)
            return;

        if (scanJob.Target == null)
        {
            scanJob.Status = ScanStatus.Failed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.Summary = "Scan failed: target not found.";
            await _context.SaveChangesAsync();
            return;
        }

        try
        {
            scanJob.Status = ScanStatus.Running;
            scanJob.Summary = "ZAP scan is running...";
            await _context.SaveChangesAsync();

            var jsonFilePath = await _zapRunnerService.RunZapScanAsync(scanJobId, scanJob.Target.BaseUrl);
            var importedRows = await _zapImportService.ImportFromJsonAsync(scanJobId, jsonFilePath);

            var severityCounts = await _context.Findings
                .Where(f => f.ScanJobId == scanJobId)
                .GroupBy(f => f.Severity)
                .Select(g => new { Severity = g.Key, Count = g.Count() })
                .ToListAsync();

            var orderedSummaryParts = severityCounts
                .OrderByDescending(x => SeverityHelper.Rank(x.Severity))
                .Select(x => $"{x.Count} {x.Severity}")
                .ToList();

            scanJob = await _context.ScanJobs.FirstAsync(x => x.Id == scanJobId);
            scanJob.Status = ScanStatus.Completed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.ReportGeneratedAt = DateTime.UtcNow;
            scanJob.Tool = "ZAP";
            scanJob.Summary = $"ZAP execution completed successfully. {importedRows} finding rows imported. Breakdown: {string.Join(", ", orderedSummaryParts)}.";

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Stage 3 ZAP execution failed for ScanJob {ScanJobId}", scanJobId);

            scanJob = await _context.ScanJobs.FirstAsync(x => x.Id == scanJobId);
            scanJob.Status = ScanStatus.Failed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.Summary = $"ZAP execution failed: {ex.Message}";
            await _context.SaveChangesAsync();
        }
    }
}