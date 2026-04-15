namespace ScanityCheck.Api.DTOs;

public class ScanListItemResponse
{
    public int Id { get; set; }
    public int TargetId { get; set; }
    public string TargetName { get; set; } = "";
    public string? ProductName { get; set; }
    public string Environment { get; set; } = "";
    public int StartedByUserId { get; set; }
    public string Tool { get; set; } = "";
    public string Scope { get; set; } = "";
    public string Status { get; set; } = "";
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? Summary { get; set; }
}