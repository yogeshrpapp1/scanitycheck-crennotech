import jsPDF from "jspdf";
import { useState } from "react";
import { useParams } from "react-router-dom";


function Reports() {
  const { id } = useParams();
  const [selectedFinding, setSelectedFinding] = useState(null);
  const findings = [
    {
      id: 1,
      scanJobId: 2,
      title: "Missing Security Headers",
      severity: "Medium",
      endpoint: "/api",
      description: "Security headers missing",
      recommendation: "Add security headers",
      evidenceLogs: [
        {
          requestData: "GET /api",
          responseData: "No headers found",
          notes: "Simulated result"
        }
      ]
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Scan Report</h1>
      <h2>Report for Scan ID: {id}</h2>

      <button style={{
        padding: "10px 15px",
        background: "#1e293b",
        color: "white",
        border: "none",
        borderRadius: "5px"
      }}>
        Export CSV
      </button>

      <h2 style={{ marginTop: "20px" }}>Vulnerabilities</h2>

      <table style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Severity</th>
            <th>Endpoint</th>
          </tr>
        </thead>

        <tbody>
          {findings.map((f) => (
            <tr
              key={f.id}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedFinding(f)}
              onMouseOver={(e) => e.currentTarget.style.background = "#faecec"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >

              <td>{f.title}</td>
              <td>
                <span style={{
                  padding: "5px 10px",
                  borderRadius: "20px",
                  color: "white",
                  background:
                    f.severity === "Critical" ? "red" :
                      f.severity === "High" ? "orange" :
                        f.severity === "Medium" ? "blue" :
                          "green"
                }}>
                  {f.severity}
                </span>
              </td>
              <td>{f.endpoint}</td>
            </tr>
          ))}
        </tbody>
      </table>


      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px"
      }}>
        <h3>Evidence</h3>

        <p><b>Description:</b> {findings[0].description}</p>
        <p><b>Request:</b> {findings[0].evidenceLogs[0].requestData}</p>
        <p><b>Response:</b> {findings[0].evidenceLogs[0].responseData}</p>
        <p><b>Notes:</b> {findings[0].evidenceLogs[0].notes}</p>
      </div>

      {selectedFinding && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "400px"
          }}>
            <h3>{selectedFinding.title}</h3>

            <p><b>Severity:</b> {selectedFinding.severity}</p>
            <p><b>Endpoint:</b> {selectedFinding.endpoint}</p>

            <p><b>Description:</b> {selectedFinding.description}</p>
            <p><b>Request:</b> {selectedFinding.evidenceLogs[0].requestData}</p>
            <p><b>Response:</b> {selectedFinding.evidenceLogs[0].responseData}</p>
            <p><b>Notes:</b> {selectedFinding.evidenceLogs[0].notes}</p>

            <button
              onClick={() => setSelectedFinding(null)}
              style={{
                marginTop: "10px",
                padding: "8px 12px",
                background: "#1e293b",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



export default Reports;