using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public class ScanCommandBuilder : IScanCommandBuilder
{
    public string BuildZapArguments(ScanTarget target, string outputFile)
    {
        var targetUrl = Escape(target.BaseUrl);
        var output = Escape(outputFile);

        var args =
            $"-cmd -port 8090 -quickurl \"{targetUrl}\" -quickout \"{output}\" -quickprogress";

        if (!string.IsNullOrWhiteSpace(target.AuthHeader))
        {
            var header = Escape(target.AuthHeader);

            args +=
                $" -config replacer.full_list(0).description=auth-header" +
                $" -config replacer.full_list(0).enabled=true" +
                $" -config replacer.full_list(0).matchtype=REQ_HEADER" +
                $" -config replacer.full_list(0).matchstr=Authorization" +
                $" -config replacer.full_list(0).replacement=\"{header}\"";
        }

        return args;
    }

    public string BuildNucleiArguments(ScanTarget target, string outputFile)
    {
        var targetUrl = Escape(target.BaseUrl);
        var output = Escape(outputFile);

        var args =
            $"-u \"{targetUrl}\" " +
            $"-jsonl " +
            $"-o \"{output}\" " +
            $"-severity info,low,medium,high,critical " +
            $"-tags tech,exposure,misconfig,cves,default-login,panel " +
            $"-rl 10 " +
            $"-c 5 " +
            $"-timeout 10 " +
            $"-retries 1 " +
            $"-silent";

        if (!string.IsNullOrWhiteSpace(target.AuthHeader))
        {
            var header = Escape(target.AuthHeader);
            args += $" -H \"{header}\"";
        }

        return args;
    }

    private static string Escape(string value)
    {
        return value.Replace("\"", "\\\"");
    }
}