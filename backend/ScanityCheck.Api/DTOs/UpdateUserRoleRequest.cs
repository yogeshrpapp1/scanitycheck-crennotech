using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class UpdateUserRoleRequest
{
    [Required]
    [MaxLength(20)]
    public string Role { get; set; } = "";
}