using System.Diagnostics;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public class NucleiRunnerService : INucleiRunnerService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<NucleiRunnerService> _logger;
    private readonly IScanCommandBuilder _commandBuilder;

    public NucleiRunnerService(
        IConfiguration configuration,
        ILogger<NucleiRunnerService> logger,
        IScanCommandBuilder commandBuilder)
    {
        _configuration = configuration;
        _logger = logger;
        _commandBuilder = commandBuilder;
    }

    public async Task<string> RunNucleiScanAsync(int scanJobId, ScanTarget target)
    {
        var nucleiPath = _configuration["NucleiSettings:NucleiPath"];
        var reportsFolder = _configuration["NucleiSettings:ReportsFolder"];

        if (string.IsNullOrWhiteSpace(nucleiPath))
            throw new Exception("Nuclei path is not configured.");

        if (!File.Exists(nucleiPath))
            throw new Exception($"Nuclei executable not found at: {nucleiPath}");

        if (string.IsNullOrWhiteSpace(reportsFolder))
            throw new Exception("Nuclei reports folder is not configured.");

        Directory.CreateDirectory(reportsFolder);


        using var httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(10)
        };

        try
        {
            var response = await httpClient.GetAsync(target.BaseUrl);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(
                    $"Target returned HTTP {(int)response.StatusCode}"
                );
            }
        }
        catch (Exception ex)
        {
            throw new Exception(
                $"Target is not reachable before Nuclei scan: {target.BaseUrl}. Error: {ex.Message}"
            );
        }


        var outputFile = Path.Combine(
            reportsFolder,
            $"nuclei-report-scan-{scanJobId}.jsonl"
        );

        if (File.Exists(outputFile))
        {
            File.Delete(outputFile);
        }

        var arguments = _commandBuilder.BuildNucleiArguments(target, outputFile);

        _logger.LogInformation("Nuclei output file: {OutputFile}", outputFile);
        _logger.LogInformation("Nuclei args: {Arguments}", arguments);

        var process = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = nucleiPath,
                Arguments = arguments,
                WorkingDirectory = reportsFolder,
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

        _logger.LogInformation("Nuclei stdout:\n{StdOut}", stdout);

        if (!string.IsNullOrWhiteSpace(stderr))
        {
            _logger.LogWarning("Nuclei stderr:\n{StdErr}", stderr);
        }

        _logger.LogInformation(
            "Nuclei exit code: {ExitCode}",
            process.ExitCode
        );

        if (process.ExitCode != 0)
        {
            throw new Exception(
                $"Nuclei failed with exit code {process.ExitCode}. Error: {stderr}"
            );
        }

        if (!File.Exists(outputFile))
        {
            throw new Exception(
                $"Nuclei completed but report file was not generated."
            );
        }

        var fileContent = await File.ReadAllTextAsync(outputFile);

        if (string.IsNullOrWhiteSpace(fileContent))
        {
            _logger.LogWarning(
                "Nuclei completed successfully but produced 0 findings for ScanJob {ScanJobId}",
                scanJobId
            );
        }

        return outputFile;
    }
}