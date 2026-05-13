using System.Diagnostics;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public class ZapRunnerService : IZapRunnerService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<ZapRunnerService> _logger;
    private readonly IScanCommandBuilder _commandBuilder;

    public ZapRunnerService(
        IConfiguration configuration,
        ILogger<ZapRunnerService> logger,
        IScanCommandBuilder commandBuilder)
    {
        _configuration = configuration;
        _logger = logger;
        _commandBuilder = commandBuilder;
    }

    public async Task<string> RunZapScanAsync(int scanJobId, ScanTarget target)
    {
        var zapPath = _configuration["ZapSettings:ZapPath"];
        var reportsFolder = _configuration["ZapSettings:ReportsFolder"];

        if (string.IsNullOrWhiteSpace(zapPath))
            throw new Exception("ZAP path is not configured.");

        if (!File.Exists(zapPath))
            throw new Exception($"ZAP executable not found at: {zapPath}");

        if (string.IsNullOrWhiteSpace(reportsFolder))
            throw new Exception("ZAP reports folder is not configured.");

        Directory.CreateDirectory(reportsFolder);

        var outputFile = Path.Combine(reportsFolder, $"zap-report-scan-{scanJobId}.json");
        var workingDirectory = Path.GetDirectoryName(zapPath)!;

        var arguments = _commandBuilder.BuildZapArguments(target, outputFile);

        _logger.LogInformation("ZAP args: {Arguments}", arguments);

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = zapPath,
                Arguments = arguments,
                WorkingDirectory = workingDirectory,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        process.Start();

        var stdoutTask = process.StandardOutput.ReadToEndAsync();
        var stderrTask = process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        var stdout = await stdoutTask;
        var stderr = await stderrTask;

        _logger.LogInformation("ZAP stdout:\n{StdOut}", stdout);

        if (!string.IsNullOrWhiteSpace(stderr))
            _logger.LogWarning("ZAP stderr:\n{StdErr}", stderr);

        if (process.ExitCode != 0)
            throw new Exception($"ZAP failed with exit code {process.ExitCode}. Error: {stderr}");

        if (!File.Exists(outputFile))
            throw new Exception($"ZAP report was not generated at: {outputFile}");

        return outputFile;
    }
}