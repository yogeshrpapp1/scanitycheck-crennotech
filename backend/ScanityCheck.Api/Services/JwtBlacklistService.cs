using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public class JwtBlacklistService : IJwtBlacklistService
{
    private readonly AppDbContext _context;

    public JwtBlacklistService(AppDbContext context)
    {
        _context = context;
    }

    public async Task RevokeTokenAsync(string token, DateTime expiresAt)
    {
        var alreadyExists = await _context.RevokedTokens
            .AnyAsync(x => x.Token == token);

        if (alreadyExists)
            return;

        _context.RevokedTokens.Add(new RevokedToken
        {
            Token = token,
            RevokedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        });

        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsTokenRevokedAsync(string token)
    {
        return await _context.RevokedTokens
            .AnyAsync(x => x.Token == token && x.ExpiresAt > DateTime.UtcNow);
    }
}