using System.ComponentModel.DataAnnotations;

namespace ScanityCheck.Api.DTOs;

public class ImportZapReportRequest
{
    [Required]
    public string JsonFilePath { get; set; } = "";
}