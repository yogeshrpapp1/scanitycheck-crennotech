import { useState, useEffect } from "react";

function Scan() {
  const [target, setTarget] = useState("");
  const [scanId, setScanId] = useState(null);
  const [status, setStatus] = useState("");
  const [tool, setTool] = useState("ZAP");

  const startScan = async () => {
  try {
  const response = await fetch("/api/scans/start", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
  },
  body: JSON.stringify({
    targetId: 1,
    tool: tool,
    scope:"Full"
  })
});

    const data = await response.json();

    console.log("Scan started:", data);

    setScanId(data.scanId); // store ID
    setStatus("Queued");

  } catch (error) {
    console.error(error);
    alert("Error starting scan");
  }
};

  useEffect(() => {
  if (!scanId) return;

  const states = ["Queued", "Running", "Completed"];
  let i = 0;

  const interval = setInterval(() => {
    const stored = JSON.parse(localStorage.getItem("scans")) || [];

    const updated = stored.map((s) => {
      if (s.id === scanId) {
        return {
          ...s,
          status: states[i],
          completedAt:
            states[i] === "Completed"
              ? new Date().toLocaleTimeString()
              : null,
          summary:
            states[i] === "Completed"
              ? "Scan completed"
              : "Scan in progress"
        };
      }
      return s;
    });

    localStorage.setItem("scans", JSON.stringify(updated));

    setStatus(states[i]);

    i++;

    if (i >= states.length) {
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
        type="text"
        placeholder="Enter target URL"
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