using System.Text;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.OpenApi.Models;
using ScanityCheck.Api.Data;
using ScanityCheck.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DockerPolicy", policy =>
    {
        // "http://localhost" is the default address for the Nginx container
        policy.WithOrigins("http://localhost")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IScanRunnerService, ScanRunnerService>();
builder.Services.AddScoped<IZapImportService, ZapImportService>();
builder.Services.AddScoped<IZapRunnerService, ZapRunnerService>();
builder.Services.AddScoped<IScanExecutionService, ScanExecutionService>();
builder.Services.AddScoped<INucleiRunnerService, NucleiRunnerService>();
builder.Services.AddScoped<INucleiImportService, NucleiImportService>();
builder.Services.AddScoped<IJwtBlacklistService, JwtBlacklistService>();

builder.Services.AddHangfire(config =>
{
    config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddHangfireServer();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var rawToken = context.Request.Headers.Authorization
                    .ToString()
                    .Replace("Bearer ", "")
                    .Trim();
                if (string.IsNullOrWhiteSpace(rawToken))
                    return;
                var blacklistService = context.HttpContext.RequestServices
                    .GetRequiredService<IJwtBlacklistService>();
                var isRevoked = await blacklistService.IsTokenRevokedAsync(rawToken);
                if (isRevoked)
                {
                    context.Fail("This token has been revoked.");
                }
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ScanityCheck API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Automatically apply any pending migrations in Development env
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        dbContext.Database.Migrate();  // Apply migrations
    }
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            message = "An unexpected server error occurred."
        });
    });
});

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("DockerPolicy");

app.UseAuthentication();
app.UseAuthorization();

// Keep Hangfire open for local dev demo.
// Later we can protect it with admin-only access.

// app.UseHangfireDashboard("/hangfire", new DashboardOptions
// {
//     Authorization = new[] { new AdminHangfireAuthorizationFilter() }

// });
// app.UseHangfireDashboard("/hangfire");

if (app.Environment.IsDevelopment())
{
    app.UseHangfireDashboard("/hangfire", new DashboardOptions
    {
        Authorization = new[] { new DevHangfireAuthorizationFilter() }
    });
}
else
{
    app.UseHangfireDashboard("/hangfire", new DashboardOptions
    {
        Authorization = new[] { new AdminHangfireAuthorizationFilter() }
    });
}

app.MapControllers();

app.Run();