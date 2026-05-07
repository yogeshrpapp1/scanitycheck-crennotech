namespace ScanityCheck.Api.Services;

public interface IJwtBlacklistService
{
    Task RevokeTokenAsync(string token, DateTime expiresAt);
    Task<bool> IsTokenRevokedAsync(string token);
}