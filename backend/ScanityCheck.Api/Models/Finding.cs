using ScanityCheck.Api.Enums;

namespace ScanityCheck.Api.Models;

public class Finding
{
    public int Id { get; set; }

    public int ScanJobId { get; set; }
    public ScanJob? ScanJob { get; set; }

    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public SeverityLevel Severity { get; set; } = SeverityLevel.Info;

    public string Endpoint { get; set; } = "";
    public string? NormalizedEndpoint { get; set; }

    public string Recommendation { get; set; } = "";
    public string SourceTool { get; set; } = "";
    public string Category { get; set; } = "General";

    public string? CweId { get; set; }
    public string? WascId { get; set; }
    public string? AlertRef { get; set; }
    public string? Confidence { get; set; }
    public string? RiskDescription { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<EvidenceLog> EvidenceLogs { get; set; } = new List<EvidenceLog>();
}