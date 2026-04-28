using System.Diagnostics;

namespace ScanityCheck.Api.Services;

public class NucleiRunnerService : INucleiRunnerService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<NucleiRunnerService> _logger;

    public NucleiRunnerService(IConfiguration configuration, ILogger<NucleiRunnerService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<string> RunNucleiScanAsync(int scanJobId, string targetUrl)
    {
        var nucleiPath = _configuration["NucleiSettings:NucleiPath"];
        var reportsFolder = _configuration["NucleiSettings:ReportsFolder"];
        var templatesPath = _configuration["NucleiSettings:TemplatesPath"];

        if (string.IsNullOrWhiteSpace(nucleiPath))
            throw new Exception("Nuclei path is not configured.");

        if (!File.Exists(nucleiPath))
            throw new Exception($"Nuclei executable not found at: {nucleiPath}");

        if (string.IsNullOrWhiteSpace(reportsFolder))
            throw new Exception("Nuclei reports folder is not configured.");

        Directory.CreateDirectory(reportsFolder);

        var outputFile = Path.Combine(reportsFolder, $"nuclei-report-scan-{scanJobId}.jsonl");

        var arguments =
            $"-u \"{targetUrl}\" -jsonl -o \"{outputFile}\" -severity info,low,medium,high,critical -silent -duc";

        if (!string.IsNullOrWhiteSpace(templatesPath) && Directory.Exists(templatesPath))
        {
            arguments += $" -t \"{templatesPath}\"";
        }

        _logger.LogInformation("Nuclei path: {NucleiPath}", nucleiPath);
        _logger.LogInformation("Nuclei reports folder: {ReportsFolder}", reportsFolder);
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

        var stdOutTask = process.StandardOutput.ReadToEndAsync();
        var stdErrTask = process.StandardError.ReadToEndAsync();

        await process.WaitForExitAsync();

        var stdOut = await stdOutTask;
        var stdErr = await stdErrTask;

        _logger.LogInformation("Nuclei stdout:\n{StdOut}", stdOut);

        if (!string.IsNullOrWhiteSpace(stdErr))
            _logger.LogWarning("Nuclei stderr:\n{StdErr}", stdErr);

        _logger.LogInformation("Nuclei exit code: {ExitCode}", process.ExitCode);

        if (process.ExitCode != 0)
            throw new Exception($"Nuclei scan process failed with exit code {process.ExitCode}. Error: {stdErr}");

        if (!File.Exists(outputFile))
        {
            await File.WriteAllTextAsync(outputFile, "");
        }

        return outputFile;
    }
}