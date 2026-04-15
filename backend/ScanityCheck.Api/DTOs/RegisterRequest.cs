using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class RegisterRequest
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = "";

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(8)]
    [MaxLength(100)]
    public string Password { get; set; } = "";
}