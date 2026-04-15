namespace ScanityCheck.Api.Models;

public class ScanTarget
{
    public int Id { get; set; }

    public string Name { get; set; } = "";
    public string BaseUrl { get; set; } = "";
    public string? OpenApiUrl { get; set; }
    public bool RequiresAuth { get; set; }

    public string? ClientName { get; set; }
    public string? ProductName { get; set; }
    public string Environment { get; set; } = "Development";
    public string? Notes { get; set; }

    public int CreatedByUserId { get; set; }
    public AppUser? CreatedByUser { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ScanJob> ScanJobs { get; set; } = new List<ScanJob>();
}