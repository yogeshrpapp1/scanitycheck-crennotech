import jsPDF from "jspdf";

function Reports() {

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Vulnerability Scan Report", 20, 20);

    doc.setFontSize(12);
    doc.text("Critical: 0", 20, 40);
    doc.text("High: 1", 20, 50);
    doc.text("Medium: 1", 20, 60);
    doc.text("Low: 1", 20, 70);

    doc.text("Findings:", 20, 90);
    doc.text("- XSS Attack (Medium)", 20, 100);
    doc.text("- IDOR (High)", 20, 110);
    doc.text("- Security Misconfig (Low)", 20, 120);

    doc.save("scan-report.pdf");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports Page</h2>

      <button
        onClick={downloadReport}
        style={{
          padding: "10px 20px",
          background: "#2c3e50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Download Report
      </button>
    </div>
  );
}

export default Reports;