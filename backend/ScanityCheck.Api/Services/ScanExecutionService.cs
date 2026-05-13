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
    private readonly INucleiRunnerService _nucleiRunnerService;
    private readonly INucleiImportService _nucleiImportService;
    private readonly ILogger<ScanExecutionService> _logger;

    public ScanExecutionService(
        AppDbContext context,
        IZapRunnerService zapRunnerService,
        IZapImportService zapImportService,
        INucleiRunnerService nucleiRunnerService,
        INucleiImportService nucleiImportService,
        ILogger<ScanExecutionService> logger)
    {
        _context = context;
        _zapRunnerService = zapRunnerService;
        _zapImportService = zapImportService;
        _nucleiRunnerService = nucleiRunnerService;
        _nucleiImportService = nucleiImportService;
        _logger = logger;
    }

    public async Task ExecuteZapScanAsync(int scanJobId)
    {
        await ExecuteScanAsync(scanJobId);
    }

    public async Task ExecuteScanAsync(int scanJobId)
    {
        var scanJob = await _context.ScanJobs
            .Include(x => x.Target)
            .FirstOrDefaultAsync(x => x.Id == scanJobId);

        if (scanJob == null)
            return;

        if (scanJob.Target == null)
        {
            await MarkFailed(scanJob.Id, "Target not found.");
            return;
        }

        try
        {
            scanJob.Status = ScanStatus.Running;
            scanJob.Summary = $"{scanJob.Tool} scan is running...";
            await _context.SaveChangesAsync();

            var tool = scanJob.Tool.Trim();
            var zapRows = 0;
            var nucleiRows = 0;


            if (IsNucleiEnabled(tool))
            {
                _logger.LogInformation("Starting Nuclei for ScanJob {ScanJobId}", scanJobId);
                var nucleiFile = await _nucleiRunnerService.RunNucleiScanAsync(scanJobId, scanJob.Target);
                nucleiRows = await _nucleiImportService.ImportFromJsonLinesAsync(scanJobId, nucleiFile);
            }

            if (IsZapEnabled(tool))
            {
                _logger.LogInformation("Starting ZAP for ScanJob {ScanJobId}", scanJobId);
                var zapFile = await _zapRunnerService.RunZapScanAsync(scanJobId, scanJob.Target);
                zapRows = await _zapImportService.ImportFromJsonAsync(scanJobId, zapFile);
            }



            var findings = await _context.Findings
                .Where(x => x.ScanJobId == scanJobId)
                .ToListAsync();

            scanJob = await _context.ScanJobs.FirstAsync(x => x.Id == scanJobId);
            scanJob.Status = ScanStatus.Completed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.ReportGeneratedAt = DateTime.UtcNow;
            scanJob.Summary = ScanSummaryHelper.BuildSummary(findings, zapRows, nucleiRows);

            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Scan execution failed for ScanJob {ScanJobId}", scanJobId);
            await MarkFailed(scanJobId, ex.Message);
        }
    }

    private async Task MarkFailed(int scanJobId, string reason)
    {
        var scan = await _context.ScanJobs.FirstOrDefaultAsync(x => x.Id == scanJobId);

        if (scan == null)
            return;

        scan.Status = ScanStatus.Failed;
        scan.CompletedAt = DateTime.UtcNow;
        scan.Summary = $"Scan failed: {reason}";

        await _context.SaveChangesAsync();
    }

    private static bool IsZapEnabled(string tool)
    {
        return tool.Equals("ZAP", StringComparison.OrdinalIgnoreCase)
            || tool.Equals("ZAP+Nuclei", StringComparison.OrdinalIgnoreCase)
            || tool.Equals("Both", StringComparison.OrdinalIgnoreCase);
    }

    private static bool IsNucleiEnabled(string tool)
    {
        return tool.Equals("Nuclei", StringComparison.OrdinalIgnoreCase)
            || tool.Equals("ZAP+Nuclei", StringComparison.OrdinalIgnoreCase)
            || tool.Equals("Both", StringComparison.OrdinalIgnoreCase);
    }
}