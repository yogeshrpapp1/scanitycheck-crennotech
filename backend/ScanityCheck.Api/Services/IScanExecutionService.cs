namespace ScanityCheck.Api.Services;

public interface IScanExecutionService
{
    Task ExecuteZapScanAsync(int scanJobId);
}