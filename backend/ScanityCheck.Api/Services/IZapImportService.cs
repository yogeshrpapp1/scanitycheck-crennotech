namespace ScanityCheck.Api.Services;

public interface IZapImportService
{
    Task<int> ImportFromJsonAsync(int scanJobId, string jsonFilePath);
}