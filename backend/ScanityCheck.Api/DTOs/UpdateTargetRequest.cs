namespace ScanityCheck.Api.DTOs;

public class UpdateTargetRequest
{
    public string Name { get; set; } = "";

    public string BaseUrl { get; set; } = "";

    public string? OpenApiUrl { get; set; }

    public bool RequiresAuth { get; set; }

    public string? AuthHeader { get; set; }

    public string? ClientName { get; set; }

    public string? ProductName { get; set; }

    public string Environment { get; set; } = "";

    public string? Notes { get; set; }
}