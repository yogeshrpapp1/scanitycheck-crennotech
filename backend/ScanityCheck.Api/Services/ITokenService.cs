using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public interface ITokenService
{
    string CreateToken(AppUser user);
}