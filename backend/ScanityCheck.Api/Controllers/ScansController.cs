using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hangfire;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.DTOs;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Models;
using ScanityCheck.Api.Services;

namespace ScanityCheck.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScansController : ControllerBase
{
    private readonly AppDbContext _context;

    public ScansController(AppDbContext context)
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

    [HttpPost("start")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Start(StartScanRequest request)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var target = await _context.ScanTargets.FindAsync(request.TargetId);
        if (target == null)
            return NotFound(new { message = "Target not found." });

        var scan = new ScanJob
        {
            TargetId = request.TargetId,
            StartedByUserId = currentUserId,
            Tool = request.Tool,
            Scope = request.Scope,
            Status = ScanStatus.Queued,
            StartedAt = DateTime.UtcNow
        };

        _context.ScanJobs.Add(scan);
        await _context.SaveChangesAsync();

        BackgroundJob.Enqueue<IScanRunnerService>(service => service.RunScanAsync(scan.Id));

        return Ok(new
        {
            message = "Scan queued successfully.",
            scanId = scan.Id
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<ScanListItemResponse>>> GetAll()
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var query = _context.ScanJobs.Include(x => x.Target).AsQueryable();

        if (!IsAdminOrManager())
            query = query.Where(x => x.StartedByUserId == currentUserId);

        var scans = await query
            .OrderByDescending(x => x.Id)
            .Select(x => new ScanListItemResponse
            {
                Id = x.Id,
                TargetId = x.TargetId,
                TargetName = x.Target!.Name,
                ProductName = x.Target.ProductName,
                Environment = x.Target.Environment,
                StartedByUserId = x.StartedByUserId,
                Tool = x.Tool,
                Scope = x.Scope,
                Status = x.Status.ToString(),
                StartedAt = x.StartedAt,
                CompletedAt = x.CompletedAt,
                Summary = x.Summary
            })
            .ToListAsync();

        return Ok(scans);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScanDetailResponse>> GetById(int id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var query = _context.ScanJobs
            .Include(x => x.Target)
            .Include(x => x.Findings)
            .Where(x => x.Id == id);

        if (!IsAdminOrManager())
            query = query.Where(x => x.StartedByUserId == currentUserId);

        var scan = await query
            .Select(x => new ScanDetailResponse
            {
                Id = x.Id,
                TargetId = x.TargetId,
                TargetName = x.Target!.Name,
                ClientName = x.Target.ClientName,
                ProductName = x.Target.ProductName,
                Environment = x.Target.Environment,
                StartedByUserId = x.StartedByUserId,
                Tool = x.Tool,
                Scope = x.Scope,
                Status = x.Status.ToString(),
                StartedAt = x.StartedAt,
                CompletedAt = x.CompletedAt,
                ReportGeneratedAt = x.ReportGeneratedAt,
                Summary = x.Summary,
                FindingsCount = x.Findings.Count
            })
            .FirstOrDefaultAsync();

        if (scan == null)
            return NotFound(new { message = "Scan not found." });

        return Ok(scan);
    }

    [HttpGet("{id}/findings")]
    public async Task<ActionResult<List<FindingResponse>>> GetFindings(int id)
    {
        var currentUserId = GetCurrentUserId();
        if (currentUserId == 0)
            return Unauthorized();

        var scanExists = await _context.ScanJobs
            .AnyAsync(x => x.Id == id && (IsAdminOrManager() || x.StartedByUserId == currentUserId));

        if (!scanExists)
            return NotFound(new { message = "Scan not found." });

        var findings = await _context.Findings
            .Where(f => f.ScanJobId == id)
            .Include(f => f.EvidenceLogs)
            .OrderByDescending(f => f.Id)
            .Select(f => new FindingResponse
            {
                Id = f.Id,
                ScanJobId = f.ScanJobId,
                Title = f.Title,
                Description = f.Description,
                Severity = f.Severity.ToString(),
                Endpoint = f.Endpoint,
                Recommendation = f.Recommendation,
                SourceTool = f.SourceTool,
                Category = f.Category,
                CreatedAt = f.CreatedAt,
                EvidenceLogs = f.EvidenceLogs.Select(e => new EvidenceLogResponse
                {
                    Id = e.Id,
                    RequestData = e.RequestData,
                    ResponseData = e.ResponseData,
                    Notes = e.Notes,
                    CreatedAt = e.CreatedAt
                }).ToList()
            })
            .ToListAsync();

        return Ok(findings);
    }
}