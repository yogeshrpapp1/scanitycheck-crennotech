using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class StartScanRequest
{
    [Required]
    public int TargetId { get; set; }

    [Required]
    [MaxLength(50)]
    public string Tool { get; set; } = "Simulated";

    [Required]
    [MaxLength(50)]
    public string Scope { get; set; } = "Full";
}