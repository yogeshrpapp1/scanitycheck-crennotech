using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.DTOs;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TargetsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TargetsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<TargetResponse>>> GetAll()
    {
        var targets = await _context.ScanTargets
            .OrderByDescending(x => x.Id)
            .Select(x => new TargetResponse
            {
                Id = x.Id,
                Name = x.Name,
                BaseUrl = x.BaseUrl,
                OpenApiUrl = x.OpenApiUrl,
                RequiresAuth = x.RequiresAuth,
                AuthHeader = x.AuthHeader,
                ClientName = x.ClientName,
                ProductName = x.ProductName,
                Environment = x.Environment,
                Notes = x.Notes,
                CreatedByUserId = x.CreatedByUserId,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();

        return Ok(targets);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<TargetResponse>> Create(CreateTargetRequest request)
    {
        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/nameidentifier"))?.Value;
        if (string.IsNullOrWhiteSpace(userIdClaim))
            return Unauthorized();

        var target = new ScanTarget
        {
            Name = request.Name.Trim(),
            BaseUrl = request.BaseUrl.Trim(),
            OpenApiUrl = request.OpenApiUrl?.Trim(),
            RequiresAuth = request.RequiresAuth,
            AuthHeader = request.AuthHeader,
            ClientName = request.ClientName?.Trim(),
            ProductName = request.ProductName?.Trim(),
            Environment = request.Environment.Trim(),
            Notes = request.Notes?.Trim(),
            CreatedByUserId = int.Parse(userIdClaim)
        };

        _context.ScanTargets.Add(target);
        await _context.SaveChangesAsync();

        return Ok(new TargetResponse
        {
            Id = target.Id,
            Name = target.Name,
            BaseUrl = target.BaseUrl,
            OpenApiUrl = target.OpenApiUrl,
            RequiresAuth = target.RequiresAuth,
            ClientName = target.ClientName,
            ProductName = target.ProductName,
            AuthHeader = target.AuthHeader,
            Environment = target.Environment,
            Notes = target.Notes,
            CreatedByUserId = target.CreatedByUserId,
            CreatedAt = target.CreatedAt
        });
    }
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<TargetResponse>> Update(int id, UpdateTargetRequest request)
    {
        var target = await _context.ScanTargets
            .FirstOrDefaultAsync(x => x.Id == id);

        if (target == null)
            return NotFound(new { message = "Target not found." });

        target.Name = request.Name.Trim();
        target.BaseUrl = request.BaseUrl.Trim();
        target.OpenApiUrl = request.OpenApiUrl?.Trim();

        target.RequiresAuth = request.RequiresAuth;

        target.AuthHeader = request.AuthHeader;

        target.ClientName = request.ClientName?.Trim();
        target.ProductName = request.ProductName?.Trim();
        target.Environment = request.Environment.Trim();
        target.Notes = request.Notes?.Trim();

        await _context.SaveChangesAsync();

        return Ok(new TargetResponse
        {
            Id = target.Id,
            Name = target.Name,
            BaseUrl = target.BaseUrl,
            OpenApiUrl = target.OpenApiUrl,
            RequiresAuth = target.RequiresAuth,

            AuthHeader = target.AuthHeader,

            ClientName = target.ClientName,
            ProductName = target.ProductName,
            Environment = target.Environment,
            Notes = target.Notes,
            CreatedByUserId = target.CreatedByUserId,
            CreatedAt = target.CreatedAt
        });
    }
}