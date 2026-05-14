using System.Security.Claims;
using Hangfire.Dashboard;

namespace ScanityCheck.Api.Services;

public class AdminHangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var user = context.GetHttpContext().User;

        if (user.Identity?.IsAuthenticated != true) 
            {
                return false;
            }

        // Check for Admin role specifically in the Claims
        return user.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == "Admin") || 
            user.IsInRole("Admin");
    }
}