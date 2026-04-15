using Microsoft.EntityFrameworkCore;
using ScanityCheck.Api.Models;

namespace ScanityCheck.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<AppUser> Users => Set<AppUser>();
    public DbSet<ScanTarget> ScanTargets => Set<ScanTarget>();
    public DbSet<ScanJob> ScanJobs => Set<ScanJob>();
    public DbSet<Finding> Findings => Set<Finding>();
    public DbSet<EvidenceLog> EvidenceLogs => Set<EvidenceLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>()
            .HasIndex(x => x.Email)
            .IsUnique();

        modelBuilder.Entity<AppUser>()
            .Property(x => x.Role)
            .HasConversion<string>();

        modelBuilder.Entity<ScanJob>()
            .Property(x => x.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Finding>()
            .Property(x => x.Severity)
            .HasConversion<string>();

        modelBuilder.Entity<ScanTarget>()
            .HasOne(x => x.CreatedByUser)
            .WithMany()
            .HasForeignKey(x => x.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ScanJob>()
            .HasOne(x => x.StartedByUser)
            .WithMany()
            .HasForeignKey(x => x.StartedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}