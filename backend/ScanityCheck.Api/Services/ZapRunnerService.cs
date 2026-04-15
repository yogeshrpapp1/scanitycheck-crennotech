using System.Diagnostics;

namespace ScanityCheck.Api.Services;

public class ZapRunnerService : IZapRunnerService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ZapRunnerService> _logger;

    public ZapRunnerService(IConfiguration configuration, ILogger<ZapRunnerService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> RunZapScanAsync(int scanJobId, string targetUrl)
    {
        var zapPath = _configuration["ZapSettings:ZapPath"];
        var reportsFolder = _configuration["ZapSettings:ReportsFolder"];

        if (string.IsNullOrWhiteSpace(zapPath))
            throw new Exception("ZAP path is not configured.");

        if (!File.Exists(zapPath))
            throw new Exception($"ZAP executable not found at: {zapPath}");

        if (string.IsNullOrWhiteSpace(reportsFolder))
            throw new Exception("Reports folder is not configured.");

        Directory.CreateDirectory(reportsFolder);

        var outputFile = Path.Combine(reportsFolder, $"zap-report-scan-{scanJobId}.json");
        var zapWorkingDirectory = Path.GetDirectoryName(zapPath)!;

        var arguments =
            $"-cmd -port 8090 -quickurl \"{targetUrl}\" -quickout \"{outputFile}\"";

        _logger.LogInformation("ZAP path: {ZapPath}", zapPath);
        _logger.LogInformation("ZAP working dir: {ZapWorkingDirectory}", zapWorkingDirectory);
        _logger.LogInformation("ZAP args: {Arguments}", arguments);

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = zapPath,
                Arguments = arguments,
                WorkingDirectory = zapWorkingDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();

        var stdOutTask = process.StandardOutput.ReadToEndAsync();
        var stdErrTask = process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        var stdOut = await stdOutTask;
        var stdErr = await stdErrTask;

        _logger.LogInformation("ZAP stdout:\n{StdOut}", stdOut);

        if (!string.IsNullOrWhiteSpace(stdErr))
            _logger.LogError("ZAP stderr:\n{StdErr}", stdErr);

        _logger.LogInformation("ZAP exit code: {ExitCode}", process.ExitCode);

        if (process.ExitCode != 0)
            throw new Exception($"ZAP scan process failed with exit code {process.ExitCode}. Error: {stdErr}");

        if (!File.Exists(outputFile))
            throw new Exception("ZAP finished but output report file was not created.");

        return outputFile;
    }
}