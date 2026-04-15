using System.Text.Json.Serialization;

namespace ScanityCheck.Api.Models.Zap;

public class ZapReport
{
    [JsonPropertyName("@programName")]
    public string? ProgramName { get; set; }

    [JsonPropertyName("@version")]
    public string? Version { get; set; }

    [JsonPropertyName("@generated")]
    public string? Generated { get; set; }

    [JsonPropertyName("created")]
    public string? Created { get; set; }

    [JsonPropertyName("site")]
    public List<ZapSite> Site { get; set; } = new();
}

public class ZapSite
{
    [JsonPropertyName("@name")]
    public string? Name { get; set; }

    [JsonPropertyName("alerts")]
    public List<ZapAlert> Alerts { get; set; } = new();
}

public class ZapAlert
{
    [JsonPropertyName("pluginid")]
    public string? PluginId { get; set; }

    [JsonPropertyName("alertRef")]
    public string? AlertRef { get; set; }

    [JsonPropertyName("alert")]
    public string? Alert { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("riskcode")]
    public string? RiskCode { get; set; }

    [JsonPropertyName("confidence")]
    public string? Confidence { get; set; }

    [JsonPropertyName("riskdesc")]
    public string? RiskDesc { get; set; }

    [JsonPropertyName("desc")]
    public string? Desc { get; set; }

    [JsonPropertyName("solution")]
    public string? Solution { get; set; }

    [JsonPropertyName("otherinfo")]
    public string? OtherInfo { get; set; }

    [JsonPropertyName("cweid")]
    public string? CweId { get; set; }

    [JsonPropertyName("wascid")]
    public string? WascId { get; set; }

    [JsonPropertyName("instances")]
    public List<ZapInstance> Instances { get; set; } = new();
}

public class ZapInstance
{
    [JsonPropertyName("uri")]
    public string? Uri { get; set; }

    [JsonPropertyName("method")]
    public string? Method { get; set; }

    [JsonPropertyName("param")]
    public string? Param { get; set; }

    [JsonPropertyName("attack")]
    public string? Attack { get; set; }

    [JsonPropertyName("evidence")]
    public string? Evidence { get; set; }

    [JsonPropertyName("otherinfo")]
    public string? OtherInfo { get; set; }
}