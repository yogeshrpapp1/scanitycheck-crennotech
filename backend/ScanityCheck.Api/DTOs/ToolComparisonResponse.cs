namespace ScanityCheck.Api.DTOs;

public class ToolComparisonResponse
{
    public int ScanJobId { get; set; }
    public int TotalFindings { get; set; }
    public int ZapFindings { get; set; }
    public int NucleiFindings { get; set; }
    public Dictionary<string, int> SeverityBreakdown { get; set; } = new();
    public Dictionary<string, int> ToolBreakdown { get; set; } = new();
}