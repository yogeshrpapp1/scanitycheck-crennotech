using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScanityCheck.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthHeaderToTargets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthHeader",
                table: "ScanTargets",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthHeader",
                table: "ScanTargets");
        }
    }
}
