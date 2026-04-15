using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ScanityCheck.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddZapImportFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlertRef",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Confidence",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CweId",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RiskDescription",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WascId",
                table: "Findings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Attack",
                table: "EvidenceLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Evidence",
                table: "EvidenceLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HttpMethod",
                table: "EvidenceLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherInfo",
                table: "EvidenceLogs",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Parameter",
                table: "EvidenceLogs",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlertRef",
                table: "Findings");

            migrationBuilder.DropColumn(
                name: "Confidence",
                table: "Findings");

            migrationBuilder.DropColumn(
                name: "CweId",
                table: "Findings");

            migrationBuilder.DropColumn(
                name: "RiskDescription",
                table: "Findings");

            migrationBuilder.DropColumn(
                name: "WascId",
                table: "Findings");

            migrationBuilder.DropColumn(
                name: "Attack",
                table: "EvidenceLogs");

            migrationBuilder.DropColumn(
                name: "Evidence",
                table: "EvidenceLogs");

            migrationBuilder.DropColumn(
                name: "HttpMethod",
                table: "EvidenceLogs");

            migrationBuilder.DropColumn(
                name: "OtherInfo",
                table: "EvidenceLogs");

            migrationBuilder.DropColumn(
                name: "Parameter",
                table: "EvidenceLogs");
        }
    }
}
