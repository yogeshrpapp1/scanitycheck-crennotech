using ScanityCheck.Api.Enums;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Helpers;

public static class ScanSummaryHelper
{
    public static string BuildSummary(IEnumerable<Finding> findings, int zapRows, int nucleiRows)
    {
        var list = findings.ToList();

        var critical = list.Count(x => x.Severity == SeverityLevel.Critical);
        var high = list.Count(x => x.Severity == SeverityLevel.High);
        var medium = list.Count(x => x.Severity == SeverityLevel.Medium);
        var low = list.Count(x => x.Severity == SeverityLevel.Low);
        var info = list.Count(x => x.Severity == SeverityLevel.Info);

        return $"Scan completed. Total findings: {list.Count}. " +
               $"Critical: {critical}, High: {high}, Medium: {medium}, Low: {low}, Info: {info}. " +
               $"ZAP findings: {zapRows}, Nuclei findings: {nucleiRows}.";
    }
}