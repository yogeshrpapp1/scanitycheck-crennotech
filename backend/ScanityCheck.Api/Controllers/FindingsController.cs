using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
namespace ScanityCheck.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FindingsController : ControllerBase
{
    private readonly AppDbContext _context;
    public FindingsController(AppDbContext context)
    {
        _context = context;
    }
    [HttpPatch("{id}/resolve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> ResolveFinding(int id)
    {
        var finding = await _context.Findings.FirstOrDefaultAsync(f => f.Id == id);
        if (finding == null)
            return NotFound(new { message = "Finding not found." });
        finding.IsResolved = true;
        await _context.SaveChangesAsync();
        return Ok(new
        {
            message = "Finding marked as resolved.",
            findingId = finding.Id,
            isResolved = finding.IsResolved
        });
    }
}