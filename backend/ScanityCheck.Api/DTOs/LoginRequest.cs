using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    public string Password { get; set; } = "";
}