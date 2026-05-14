using ScanityCheck.Api.Models;
using System.Security.Claims;

namespace ScanityCheck.Api.Services;

public interface ITokenService
{
    string CreateToken(AppUser user);
    ClaimsPrincipal? ValidateToken(string token);
}