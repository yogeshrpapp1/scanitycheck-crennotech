namespace ScanityCheck.Api.DTOs;

public class GroupedFindingResponse
{
    public string Title { get; set; } = "";
    public string Severity { get; set; } = "";
    public string? AlertRef { get; set; }
    public string? CweId { get; set; }
    public string? WascId { get; set; }
    public int Count { get; set; }
    public List<string> AffectedEndpoints { get; set; } = new();
    public string Recommendation { get; set; } = "";
}