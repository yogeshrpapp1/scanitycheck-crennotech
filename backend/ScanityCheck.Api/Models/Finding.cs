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
    public string Recommendation { get; set; } = "";
    public string SourceTool { get; set; } = "";
    public string Category { get; set; } = "General";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<EvidenceLog> EvidenceLogs { get; set; } = new List<EvidenceLog>();
}