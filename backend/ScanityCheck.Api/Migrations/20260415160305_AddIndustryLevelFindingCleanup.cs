using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScanityCheck.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIndustryLevelFindingCleanup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NormalizedEndpoint",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NormalizedEndpoint",
                table: "Findings");
        }
    }
}
