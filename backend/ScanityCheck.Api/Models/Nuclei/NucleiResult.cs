using System.Text.Json.Serialization;

namespace ScanityCheck.Api.Models.Nuclei;

public class NucleiResult
{
    [JsonPropertyName("template-id")]
    public string? TemplateId { get; set; }

    [JsonPropertyName("template-path")]
    public string? TemplatePath { get; set; }

    [JsonPropertyName("template-url")]
    public string? TemplateUrl { get; set; }

    [JsonPropertyName("matcher-name")]
    public string? MatcherName { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("host")]
    public string? Host { get; set; }

    [JsonPropertyName("matched-at")]
    public string? MatchedAt { get; set; }

    [JsonPropertyName("extracted-results")]
    public List<string>? ExtractedResults { get; set; }

    [JsonPropertyName("info")]
    public NucleiInfo? Info { get; set; }

    [JsonPropertyName("timestamp")]
    public string? Timestamp { get; set; }

    [JsonPropertyName("curl-command")]
    public string? CurlCommand { get; set; }

    [JsonPropertyName("matcher-status")]
    public bool? MatcherStatus { get; set; }
}

public class NucleiInfo
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("author")]
    public List<string>? Author { get; set; }

    [JsonPropertyName("tags")]
    public List<string>? Tags { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("reference")]
    public List<string>? Reference { get; set; }

    [JsonPropertyName("severity")]
    public string? Severity { get; set; }

    [JsonPropertyName("classification")]
    public NucleiClassification? Classification { get; set; }

    [JsonPropertyName("metadata")]
    public Dictionary<string, object>? Metadata { get; set; }
}

public class NucleiClassification
{
    [JsonPropertyName("cve-id")]
    public List<string>? CveId { get; set; }

    [JsonPropertyName("cwe-id")]
    public List<string>? CweId { get; set; }

    [JsonPropertyName("cvss-score")]
    public double? CvssScore { get; set; }
}