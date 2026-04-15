namespace ScanityCheck.Api.Services;

public interface IScanRunnerService
{
    Task RunScanAsync(int scanJobId);
}