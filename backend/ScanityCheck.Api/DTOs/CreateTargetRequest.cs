using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class CreateTargetRequest
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = "";

    [Required]
    [Url]
    public string BaseUrl { get; set; } = "";

    [Url]
    public string? OpenApiUrl { get; set; }

    public bool RequiresAuth { get; set; }

    [MaxLength(150)]
    public string? ClientName { get; set; }

    [MaxLength(150)]
    public string? ProductName { get; set; }

    [Required]
    [MaxLength(50)]
    public string Environment { get; set; } = "Development";

    [MaxLength(500)]
    public string? Notes { get; set; }
}