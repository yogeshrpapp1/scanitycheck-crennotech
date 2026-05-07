namespace ScanityCheck.Api.DTOs;

public class FindingResponse
{
    public int Id { get; set; }
    public int ScanJobId { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Severity { get; set; } = "";
    public string Endpoint { get; set; } = "";
    public string? NormalizedEndpoint { get; set; }
    public string Recommendation { get; set; } = "";
    public string SourceTool { get; set; } = "";
    public string Category { get; set; } = "";

    public string? CweId { get; set; }
    public string? WascId { get; set; }
    public string? AlertRef { get; set; }
    public string? Confidence { get; set; }
    public string? RiskDescription { get; set; }
    public bool? IsResolved { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<EvidenceLogResponse> EvidenceLogs { get; set; } = new();
}