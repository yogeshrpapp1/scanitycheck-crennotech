namespace ScanityCheck.Api.Services;

public interface INucleiRunnerService
{
    Task<string> RunNucleiScanAsync(int scanJobId, string targetUrl);
}