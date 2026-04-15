using System.Text.RegularExpressions;

namespace ScanityCheck.Api.Helpers;

public static class FindingNormalizationHelper
{
    private static readonly string[] InternalPathPatterns =
    {
        "/node_modules/",
        "/build/",
        "/dist/",
        "/vendor/",
        "/webpack/",
        "/static/js/",
        "/static/css/",
        "/assets/public/",
        "/.git/",
        "/coverage/",
        "/tmp/",
        "/temp/"
    };

    public static string NormalizeEndpoint(string? endpoint)
    {
        if (string.IsNullOrWhiteSpace(endpoint))
            return string.Empty;

        var value = endpoint.Trim();

        value = RemoveQueryParams(value);
        value = RemoveTrailingLineNumbers(value);
        value = NormalizeDynamicIds(value);

        if (IsInternalPath(value))
            return "[internal-path]";

        return value;
    }

    public static bool ShouldHideFromGroupedOutput(string? endpoint)
    {
        if (string.IsNullOrWhiteSpace(endpoint))
            return true;

        var value = endpoint.Trim();

        if (IsInternalPath(value))
            return true;

        if (value.EndsWith(".map", StringComparison.OrdinalIgnoreCase))
            return true;

        return false;
    }

    private static bool IsInternalPath(string value)
    {
        return InternalPathPatterns.Any(p =>
            value.Contains(p, StringComparison.OrdinalIgnoreCase));
    }

    private static string RemoveQueryParams(string value)
    {
        var index = value.IndexOf('?');
        return index > 0 ? value[..index] : value;
    }

    private static string RemoveTrailingLineNumbers(string value)
    {
        return Regex.Replace(value, @":\d+(:\d+)?$", "");
    }

    private static string NormalizeDynamicIds(string value)
    {
        // Replace numeric IDs in path with {id}
        value = Regex.Replace(value, @"/\d+([/?]|$)", "/{id}$1");

        // Replace GUID-like values
        value = Regex.Replace(
            value,
            @"/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}([/?]|$)",
            "/{guid}$1"
        );

        return value;
    }
}