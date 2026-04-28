namespace ScanityCheck.Api.Services;

public interface INucleiImportService
{
    Task<int> ImportFromJsonLinesAsync(int scanJobId, string jsonlFilePath);
}