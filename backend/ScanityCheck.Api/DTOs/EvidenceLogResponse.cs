namespace ScanityCheck.Api.DTOs;

public class EvidenceLogResponse
{
    public int Id { get; set; }
    public string? RequestData { get; set; }
    public string? ResponseData { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}