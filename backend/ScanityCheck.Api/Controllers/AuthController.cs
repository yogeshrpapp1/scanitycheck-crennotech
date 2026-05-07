using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.DTOs;
using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Models;
using ScanityCheck.Api.Services;

namespace ScanityCheck.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext context, ITokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLower();

        if (await _context.Users.AnyAsync(x => x.Email == email))
            return BadRequest(new { message = "Email already exists." });

        var isFirstUser = !await _context.Users.AnyAsync();

        var user = new AppUser
        {
            FullName = request.FullName.Trim(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = isFirstUser ? UserRole.Admin : UserRole.Staff
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = _tokenService.CreateToken(user)
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLower();

        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        if (user == null)
            return Unauthorized(new { message = "Invalid email or password." });

        var ok = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!ok)
            return Unauthorized(new { message = "Invalid email or password." });

        return Ok(new AuthResponse
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString(),
            Token = _tokenService.CreateToken(user)
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var email = User.Claims.FirstOrDefault(c => c.Type.EndsWith("/emailaddress"))?.Value;
        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized();

        var user = await _context.Users
            .Where(x => x.Email == email)
            .Select(x => new
            {
                x.Id,
                x.FullName,
                x.Email,
                Role = x.Role.ToString(),
                x.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return Unauthorized();

        return Ok(user);
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromServices] IJwtBlacklistService blacklistService)
    {
        var authHeader = Request.Headers.Authorization.ToString();

        if (string.IsNullOrWhiteSpace(authHeader) || !authHeader.StartsWith("Bearer "))
            return BadRequest(new { message = "Bearer token is missing." });

        var token = authHeader.Replace("Bearer ", "").Trim();

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        await blacklistService.RevokeTokenAsync(token, jwtToken.ValidTo);

        return Ok(new
        {
            message = "Logged out successfully. Token has been revoked."
        });
    }
}