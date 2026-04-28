import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";







function Dashboard() {

  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
  }
}, []);


  const [scans, setScans] = useState([]);
  const [selectedScanId, setSelectedScanId] = useState(null);
const [findings, setFindings] = useState([]);
 useEffect(() => {
  const fetchScans = async () => {
    try {
      const res = await fetch("/api/Scans", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      console.log("Dashboard scans:", data);

      setScans(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading scans:", error);
    }
  };

  fetchScans();

  const interval = setInterval(fetchScans, 3000);

  return () => clearInterval(interval);
}, []);





const fetchFindings = async (scanId) => {
  try {
    const res = await fetch(`/api/Scans/${scanId}/findings`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    console.log("Findings:", data);

    setSelectedScanId(scanId);
    if (!res.ok) {
  console.log("Findings API error:", data);
  setFindings([]);
  alert(data.title || "Invalid scan ID");
  return;
}

setFindings(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error fetching findings:", error);
  }
};
  return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #e2e8f0, #f8fafc)",
      padding: "30px"
    }}
  >
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto"
      }}
    >
      <h1
        style={{
          marginBottom: "25px",
          color: "#0f172a",
          fontWeight: "700",
          textAlign: "center"
        }}
      >
        Dashboard
      </h1>

      {/* Severity cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Critical</h3>
          <p style={{ color: "red", fontSize: "28px", fontWeight: "700" }}>1</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>High</h3>
          <p style={{ color: "orange", fontSize: "28px", fontWeight: "700" }}>2</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Medium</h3>
          <p style={{ color: "blue", fontSize: "28px", fontWeight: "700" }}>1</p>
        </div>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Low</h3>
          <p style={{ color: "green", fontSize: "28px", fontWeight: "700" }}>0</p>
        </div>
      </div>

      {/* Start scan button */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px"
        }}
      >
        <button
          onClick={() => navigate("/scan")}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600"
          }}
          onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.background = "#2563eb")}
        >
          + Start New Scan
        </button>
      </div>

      {/* Table card */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          overflowX: "auto"
        }}
      >
        <h2
          style={{
            marginBottom: "18px",
            color: "#0f172a",
            fontWeight: "600"
          }}
        >
          Scan Jobs
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead style={{ background: "#1e293b", color: "white" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "center" }}>Scan ID</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Target URL</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Tool</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Start Time</th>
              <th style={{ padding: "12px", textAlign: "center" }}>End Time</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Summary</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {scans.map((scan) => (
              <tr
                key={scan.id}
                style={{
                  borderBottom: "1px solid #eee",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                <td style={{ padding: "12px", textAlign: "center" }}>{scan.id}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>{scan.targetName}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>{scan.tool}</td>

                <td style={{ padding: "12px", textAlign: "center" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "white",
                      background:
                        scan.status === "Completed"
                          ? "#22c55e"
                          : scan.status === "Running"
                          ? "#3b82f6"
                          : scan.status === "Queued"
                          ? "#f59e0b"
                          : "#ef4444"
                    }}
                  >
                    {scan.status}
                  </span>
                </td>

                <td style={{ padding: "12px", wordBreak: "break-all", textAlign: "center" }}>{scan.startedAt}</td>
                <td style={{ padding: "12px", wordBreak: "break-all", textAlign: "center" }}>{scan.completedAt || "-"}</td>
                <td style={{ padding: "12px", textAlign: "center" }}>{scan.summary}</td>

                <td style={{ padding: "12px", textAlign: "center" }}>
                  
                    <button
                      onClick={() => navigate(`/report/${scan.id}`)}
                      style={{
                        padding: "6px 12px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      View Report
                    </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedScanId && (
  <div style={{ marginTop: "25px" }}>
    <h2>Findings for Scan {selectedScanId}</h2>

    {findings.length === 0 ? (
      <p>No findings found</p>
    ) : (
      findings.map((finding) => (
        <div
          key={finding.id}
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "10px",
            background: "#f8fafc",
          }}
        >
          <h3>{finding.title}</h3>
          <p><b>Severity:</b> {finding.severity}</p>
          <p><b>Endpoint:</b> {finding.endpoint}</p>
          <p>{finding.description}</p>
        </div>
      ))
    )}
  </div>
)}
      </div>
    </div>
  </div>
);
}

export default Dashboard;