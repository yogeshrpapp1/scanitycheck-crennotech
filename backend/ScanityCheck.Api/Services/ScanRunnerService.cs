using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public class ScanRunnerService : IScanRunnerService
{
    private readonly AppDbContext _context;
    private readonly ILogger<ScanRunnerService> _logger;

    public ScanRunnerService(AppDbContext context, ILogger<ScanRunnerService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task RunScanAsync(int scanJobId)
    {
        var scanJob = await _context.ScanJobs
            .Include(s => s.Target)
            .FirstOrDefaultAsync(s => s.Id == scanJobId);

        if (scanJob == null || scanJob.Target == null)
            return;

        try
        {
            scanJob.Status = ScanStatus.Running;
            await _context.SaveChangesAsync();

            await Task.Delay(2000);

            var findings = new List<Finding>
            {
                new Finding
                {
                    ScanJobId = scanJob.Id,
                    Title = "Missing Security Headers",
                    Description = "The application response is missing common security headers.",
                    Severity = SeverityLevel.Medium,
                    Endpoint = scanJob.Target.BaseUrl,
                    Recommendation = "Add Content-Security-Policy, X-Frame-Options, and X-Content-Type-Options.",
                    SourceTool = scanJob.Tool,
                    Category = "Security Misconfiguration",
                    EvidenceLogs = new List<EvidenceLog>
                    {
                        new EvidenceLog
                        {
                            RequestData = $"GET {scanJob.Target.BaseUrl}",
                            ResponseData = "Response did not include expected security headers.",
                            Notes = $"Environment: {scanJob.Target.Environment}"
                        }
                    }
                },
                new Finding
                {
                    ScanJobId = scanJob.Id,
                    Title = "Potential Rate Limiting Missing",
                    Description = "Sensitive endpoints may not enforce proper request throttling.",
                    Severity = SeverityLevel.Low,
                    Endpoint = $"{scanJob.Target.BaseUrl}/api/login",
                    Recommendation = "Add rate limiting and login lockout protection.",
                    SourceTool = scanJob.Tool,
                    Category = "API Security",
                    EvidenceLogs = new List<EvidenceLog>
                    {
                        new EvidenceLog
                        {
                            RequestData = $"POST {scanJob.Target.BaseUrl}/api/login",
                            ResponseData = "Multiple requests accepted without throttling.",
                            Notes = $"Scope: {scanJob.Scope}"
                        }
                    }
                },
                new Finding
                {
                    ScanJobId = scanJob.Id,
                    Title = "Broken Access Control Check Required",
                    Description = "Privileged endpoint should be reviewed for role-based access control.",
                    Severity = SeverityLevel.High,
                    Endpoint = $"{scanJob.Target.BaseUrl}/api/admin",
                    Recommendation = "Enforce server-side authorization checks for all privileged endpoints.",
                    SourceTool = scanJob.Tool,
                    Category = "Access Control",
                    EvidenceLogs = new List<EvidenceLog>
                    {
                        new EvidenceLog
                        {
                            RequestData = $"GET {scanJob.Target.BaseUrl}/api/admin",
                            ResponseData = "Endpoint flagged for access control verification.",
                            Notes = $"Product: {scanJob.Target.ProductName ?? "N/A"}"
                        }
                    }
                }
            };

            _context.Findings.AddRange(findings);
            await _context.SaveChangesAsync();

            scanJob.Status = ScanStatus.Completed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.ReportGeneratedAt = DateTime.UtcNow;
            scanJob.Summary = $"{findings.Count} findings generated for {scanJob.Target.Name}.";
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while running scan job {ScanJobId}", scanJobId);

            scanJob.Status = ScanStatus.Failed;
            scanJob.CompletedAt = DateTime.UtcNow;
            scanJob.Summary = ex.Message;
            await _context.SaveChangesAsync();
        }
    }
}