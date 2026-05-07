using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScanityCheck.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddIsResolvedToFinding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsResolved",
                table: "Findings",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsResolved",
                table: "Findings");
        }
    }
}
