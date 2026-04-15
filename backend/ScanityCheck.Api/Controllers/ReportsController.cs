using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.DTOs;

namespace ScanityCheck.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReportsController(AppDbContext context)
    {
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var value = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"))?.Value;
        return int.TryParse(value, out var id) ? id : 0;
    }

    private bool IsAdminOrManager()
    {
        return User.IsInRole("Admin") || User.IsInRole("Manager");
    }

    [HttpGet("{scanJobId}/summary")]
    public async Task<ActionResult<ReportSummaryResponse>> GetSummary(int scanJobId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var query = _context.ScanJobs
            .Include(s => s.Target)
            .Include(s => s.Findings)
            .Where(s => s.Id == scanJobId);

        if (!IsAdminOrManager())
            query = query.Where(s => s.StartedByUserId == currentUserId);

        var scan = await query.FirstOrDefaultAsync();

        if (scan == null)
            return NotFound(new { message = "Scan not found." });

        var severityBreakdown = scan.Findings
            .GroupBy(f => f.Severity.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        return Ok(new ReportSummaryResponse
        {
            Id = scan.Id,
            TargetName = scan.Target!.Name,
            ClientName = scan.Target.ClientName,
            ProductName = scan.Target.ProductName,
            Environment = scan.Target.Environment,
            Tool = scan.Tool,
            Scope = scan.Scope,
            Status = scan.Status.ToString(),
            StartedAt = scan.StartedAt,
            CompletedAt = scan.CompletedAt,
            ReportGeneratedAt = scan.ReportGeneratedAt,
            Summary = scan.Summary,
            FindingsCount = scan.Findings.Count,
            SeverityBreakdown = severityBreakdown
        });
    }

    [HttpGet("{scanJobId}/csv")]
    public async Task<IActionResult> ExportCsv(int scanJobId)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var allowed = await _context.ScanJobs
            .AnyAsync(s => s.Id == scanJobId && (IsAdminOrManager() || s.StartedByUserId == currentUserId));

        if (!allowed)
            return NotFound(new { message = "Scan not found." });

        var findings = await _context.Findings
            .Where(f => f.ScanJobId == scanJobId)
            .OrderBy(f => f.Id)
            .ToListAsync();

        if (!findings.Any())
            return NotFound(new { message = "No findings found for this scan." });

        var sb = new StringBuilder();
        sb.AppendLine("Id,Title,Category,Severity,Endpoint,SourceTool,Description,Recommendation");

        foreach (var finding in findings)
        {
            sb.AppendLine(string.Join(",",
                EscapeCsv(finding.Id.ToString()),
                EscapeCsv(finding.Title),
                EscapeCsv(finding.Category),
                EscapeCsv(finding.Severity.ToString()),
                EscapeCsv(finding.Endpoint),
                EscapeCsv(finding.SourceTool),
                EscapeCsv(finding.Description),
                EscapeCsv(finding.Recommendation)
            ));
        }

        return File(
            Encoding.UTF8.GetBytes(sb.ToString()),
            "text/csv",
            $"scan-report-{scanJobId}.csv"
        );
    }

    private static string EscapeCsv(string value)
    {
        value ??= string.Empty;
        return $"\"{value.Replace("\"", "\"\"")}\"";
    }
}