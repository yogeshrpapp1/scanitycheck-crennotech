namespace ScanityCheck.Api.DTOs;

public class EvidenceLogResponse
{
    public int Id { get; set; }
    public string? RequestData { get; set; }
    public string? ResponseData { get; set; }
    public string? Notes { get; set; }

    public string? HttpMethod { get; set; }
    public string? Parameter { get; set; }
    public string? Attack { get; set; }
    public string? Evidence { get; set; }
    public string? OtherInfo { get; set; }

    public DateTime CreatedAt { get; set; }
}