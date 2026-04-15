using System.Text.Json.Serialization;

namespace ScanityCheck.Api.Models;

public class EvidenceLog
{
    public int Id { get; set; }

    public int FindingId { get; set; }

    [JsonIgnore]
    public Finding? Finding { get; set; }

    public string? RequestData { get; set; }
    public string? ResponseData { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}