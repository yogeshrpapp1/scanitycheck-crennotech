using ScanityCheck.Api.Enums;

namespace ScanityCheck.Api.Helpers;

public static class SeverityHelper
{
    public static SeverityLevel FromZapRiskCode(string? riskCode)
    {
        return riskCode switch
        {
            "3" => SeverityLevel.High,
            "2" => SeverityLevel.Medium,
            "1" => SeverityLevel.Low,
            _ => SeverityLevel.Info
        };
    }

    public static int Rank(SeverityLevel severity)
    {
        return severity switch
        {
            SeverityLevel.Critical => 5,
            SeverityLevel.High => 4,
            SeverityLevel.Medium => 3,
            SeverityLevel.Low => 2,
            SeverityLevel.Info => 1,
            _ => 0
        };
    }

    public static int Rank(string severity)
    {
        return severity switch
        {
            "Critical" => 5,
            "High" => 4,
            "Medium" => 3,
            "Low" => 2,
            "Info" => 1,
            _ => 0
        };
    }
}