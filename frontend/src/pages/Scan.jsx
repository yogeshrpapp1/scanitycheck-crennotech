import { useState, useEffect } from "react";

function Scan() {
  const [target, setTarget] = useState("");
  const [scanId, setScanId] = useState(null);
  const [status, setStatus] = useState("");
  const [tool, setTool] = useState("ZAP");

 const startSingleScan = async (selectedTool) => {
  const response = await fetch("/api/Scans/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      targetId: parseInt(target, 10),
      tool: selectedTool,
      scope: "Full",
    }),
  });

  const text = await response.text();
const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || data.title || `${selectedTool} scan failed`);
  }

  return data;
};

const startScan = async () => {
  if (!target) {
    alert("Enter target ID");
    return;
  }

  try {
    setStatus("Starting...");

    if (tool === "Both") {
      const zap = await startSingleScan("ZAP");
      const nuclei = await startSingleScan("Nuclei");

      console.log("ZAP:", zap);
      console.log("Nuclei:", nuclei);

      setScanId(zap.scanId);//for both scans
setStatus(`Both scans started: ZAP #${zap.scanId}, Nuclei #${nuclei.scanId}`);
    } else {
      const data = await startSingleScan(tool);

      console.log("Scan:", data);

      setScanId(data.scanId);
      setStatus(`${tool} scan started`);
    }
  } catch (error) {
    console.error(error);
    setStatus("Failed");
    alert(error.message);
  }
};

 useEffect(() => {
  if (!scanId) return;

  const interval = setInterval(async () => {
    const res = await fetch(`/api/Scans/${scanId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    console.log("Status response:", data);

    if (!res.ok) {
      console.log("Status API error:", data);
      return;
    }

    const currentStatus =
  data.status ||
  data.state ||
  data.scanStatus ||
  (data.id ? "Running" : "Queued");

    setStatus(currentStatus);
    if (currentStatus === "Completed") {
  clearInterval(interval);
}
  }, 3000);

  return () => clearInterval(interval);
}, [scanId]);

 return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #e2e8f0, #f8fafc)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}
  >
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        width: "380px",
        textAlign: "center"
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#0f172a",
          fontWeight: "600"
        }}
      >
        Start Scan
      </h2>

      <input
        type="number"
        placeholder="Enter target id"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #e2e8f0",
          outline: "none"
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #2563eb")}
        onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
      />

      <select
  value={tool}
  onChange={(e) => setTool(e.target.value)}
  style={{
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0"
  }}
>
  <option value="ZAP">ZAP</option>
  <option value="Nuclei">Nuclei</option>
  <option value="Both">Both</option>
</select>

      <button
        onClick={startScan}
        style={{
          width: "100%",
          padding: "12px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "600",
          marginBottom: "18px"
        }}
        onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
        onMouseOut={(e) => (e.target.style.background = "#2563eb")}
      >
        Start Scan
      </button>

      <div
        style={{
          background: "#f8fafc",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}
      >
        <span style={{ color: "#475569", fontWeight: "600" }}>Status: </span>
        <span
          style={{
            color:
              status === "Completed"
                ? "#16a34a"
                : status === "Running"
                ? "#2563eb"
                : status === "Queued"
                ? "#d97706"
                : "#64748b",
            fontWeight: "600"
          }}
        >
          {status || "Not started"}
        </span>
      </div>
    </div>
  </div>
);
}

export default Scan;