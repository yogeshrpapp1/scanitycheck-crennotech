using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Helpers;

public static class FindingDeduplicationHelper
{
    public static string BuildFingerprint(string title, string endpoint, string? cweId, string sourceTool)
    {
        var cleanTitle = Normalize(title);
        var cleanEndpoint = Normalize(endpoint);
        var cleanCwe = Normalize(cweId ?? "");

        return $"{cleanTitle}|{cleanEndpoint}|{cleanCwe}";
    }

    public static bool IsDuplicate(IEnumerable<Finding> existing, Finding incoming)
    {
        var incomingFingerprint = BuildFingerprint(
            incoming.Title,
            incoming.NormalizedEndpoint ?? incoming.Endpoint,
            incoming.CweId,
            incoming.SourceTool
        );

        return existing.Any(f =>
            BuildFingerprint(
                f.Title,
                f.NormalizedEndpoint ?? f.Endpoint,
                f.CweId,
                f.SourceTool
            ) == incomingFingerprint
        );
    }

    private static string Normalize(string value)
    {
        return value.Trim().ToLowerInvariant();
    }
}