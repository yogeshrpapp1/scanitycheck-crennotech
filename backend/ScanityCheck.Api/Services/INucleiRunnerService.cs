using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public interface INucleiRunnerService
{
    Task<string> RunNucleiScanAsync(int scanJobId, ScanTarget target);
}