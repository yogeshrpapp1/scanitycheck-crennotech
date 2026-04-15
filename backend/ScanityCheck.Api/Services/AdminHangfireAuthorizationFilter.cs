using System.Security.Claims;
using Hangfire.Dashboard;

namespace ScanityCheck.Api.Services;

public class AdminHangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        if (!httpContext.User.Identity?.IsAuthenticated ?? true)
            return false;

        return httpContext.User.IsInRole("Admin");
    }
}