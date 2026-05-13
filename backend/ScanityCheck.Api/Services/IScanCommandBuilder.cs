using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Services;

public interface IScanCommandBuilder
{
    string BuildZapArguments(ScanTarget target, string outputFile);
    string BuildNucleiArguments(ScanTarget target, string outputFile);
}