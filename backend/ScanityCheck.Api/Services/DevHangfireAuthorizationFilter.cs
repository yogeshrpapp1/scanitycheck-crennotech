using Hangfire.Dashboard;

namespace ScanityCheck.Api.Services
{
    public class DevHangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            // Always allow access in development
            return true;
        }
    }
}