// Report page - findings drill-down, HTML fix, mark as resolved
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Report() {

  const { id } = useParams();
  const [findings, setFindings] = useState([]);
  const [summary, setSummary] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  });

  const [selectedSeverity, setSelectedSeverity] = useState("All");

  useEffect(() => {
    const fetchReportData = async () => {
      const token = localStorage.getItem("token");

      const findingsRes = await fetch(`/api/Scans/${id}/findings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const findingsData = await findingsRes.json();
      setFindings(Array.isArray(findingsData) ? findingsData : []);

      const summaryRes = await fetch(`/api/Scans/${id}/findings/grouped`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const summaryData = await summaryRes.json();

      const allFindings = Array.isArray(findingsData) ? findingsData : [];
      setSummary({
        critical: allFindings.filter(f => f.severity === "Critical").length,
        high: allFindings.filter(f => f.severity === "High").length,
        medium: allFindings.filter(f => f.severity === "Medium").length,
        low: allFindings.filter(f => f.severity === "Low").length,
      });
    };

    fetchReportData();
  }, [id]);



  const filteredFindings =
    selectedSeverity === "All"
      ? findings
      : findings.filter(
        (f) =>
          f.severity?.toLowerCase() === selectedSeverity.toLowerCase()
      );

  const exportCSV = async () => {
    try {
      const res = await fetch(`/api/reports/${id}/csv`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        alert("Failed to export CSV");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `scan-report-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export error:", error);
      alert("Error exporting CSV");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Report for Scan {id}</h1>

      <button
        onClick={exportCSV}
        style={{
          marginBottom: "20px",
          padding: "10px 15px",
          background: "#16a34a",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Export CSV
      </button>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div>Critical: {summary.critical}</div>
        <div>High: {summary.high}</div>
        <div>Medium: {summary.medium}</div>
        <div>Low: {summary.low}</div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
        {["All", "Critical", "High", "Medium", "Low"].map((severity) => (
          <button
            key={severity}
            onClick={() => setSelectedSeverity(severity)}
            style={{
              padding: "8px 14px",
              background: selectedSeverity === severity ? "#2563eb" : "#e5e7eb",
              color: selectedSeverity === severity ? "white" : "black",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {severity}
          </button>
        ))}
      </div>

      {filteredFindings.length === 0 ? (
        <p>No findings found</p>
      ) : (
        filteredFindings.map((f) => (
          <div key={f.id}>
            <h3>{f.title}</h3>
            <p><b>Severity:</b> {f.severity}</p>
            <p><b>Endpoint:</b> {f.endpoint}</p>
            <p dangerouslySetInnerHTML={{ __html: f.description }} />
            <button
              disabled
              style={{
                marginTop: "8px",
                padding: "6px 14px",
                background: "#e5e7eb",
                color: "#6b7280",
                border: "none",
                borderRadius: "6px",
                cursor: "not-allowed",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              Mark as Resolved (coming soon)
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Report;