using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public interface IZapRunnerService
{
    Task<string> RunZapScanAsync(int scanJobId, ScanTarget target);
}