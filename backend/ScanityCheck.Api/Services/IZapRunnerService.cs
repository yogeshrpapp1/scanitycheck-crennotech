namespace ScanityCheck.Api.Services;

public interface IZapRunnerService
{
    Task<string> RunZapScanAsync(int scanJobId, string targetUrl);
}