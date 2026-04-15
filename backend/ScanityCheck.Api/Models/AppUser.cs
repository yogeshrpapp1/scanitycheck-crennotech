using ScanityCheck.Api.Enums;

namespace ScanityCheck.Api.Models;

public class AppUser
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public UserRole Role { get; set; } = UserRole.Staff;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}