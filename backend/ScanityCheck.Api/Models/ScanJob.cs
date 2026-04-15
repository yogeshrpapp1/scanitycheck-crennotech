using ScanityCheck.Api.Enums;

namespace ScanityCheck.Api.Models;

public class ScanJob
{
    public int Id { get; set; }

    public int TargetId { get; set; }
    public ScanTarget? Target { get; set; }

    public int StartedByUserId { get; set; }
    public AppUser? StartedByUser { get; set; }

    public string Tool { get; set; } = "Simulated";
    public string Scope { get; set; } = "Full";
    public ScanStatus Status { get; set; } = ScanStatus.Queued;

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public DateTime? ReportGeneratedAt { get; set; }

    public string? Summary { get; set; }

    public ICollection<Finding> Findings { get; set; } = new List<Finding>();
}