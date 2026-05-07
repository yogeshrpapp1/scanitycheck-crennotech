import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "";

const STATUS_STYLES = {
  Completed: { background: "#dcfce7", color: "#166534" },
  Running: { background: "#dbeafe", color: "#1d4ed8" },
  Queued: { background: "#fef3c7", color: "#92400e" },
  Failed: { background: "#fee2e2", color: "#991b1b" },
  Cancelled: { background: "#e5e7eb", color: "#374151" },
};

const SCAN_PROFILES = [
  { value: "Quick", label: "Quick Scan", description: "Fast scan with common checks" },
  { value: "Full", label: "Full Scan", description: "Complete scan profile" },
  { value: "Deep", label: "Deep Scan", description: "More intensive checks" },
];

const TOOLS = ["ZAP", "Nuclei", "Both"];

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function normalizeStatus(scan) {
  return scan.status || scan.state || scan.scanStatus || "Queued";
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function StatusBadge({ status }) {
  const safeStatus = status || "Queued";
  const style = STATUS_STYLES[safeStatus] || STATUS_STYLES.Queued;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "4px 10px",
        fontSize: "12px",
        fontWeight: 700,
        ...style,
      }}
    >
      {safeStatus}
    </span>
  );
}

function Drawer({ open, onClose, targets, onStartScan, submitting }) {
  const [targetId, setTargetId] = useState("");
  const [profile, setProfile] = useState("Full");
  const [tool, setTool] = useState("ZAP");

  useEffect(() => {
    if (open && targets.length && !targetId) {
      setTargetId(String(targets[0].id));
    }
  }, [open, targets, targetId]);

  const selectedProfile = useMemo(
    () => SCAN_PROFILES.find((item) => item.value === profile),
    [profile]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!targetId) {
      alert("Select a target");
      return;
    }

    await onStartScan({
      targetId: Number(targetId),
      profile,
      tool,
    });
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.35)",
          zIndex: 30,
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "420px",
          maxWidth: "100vw",
          height: "100vh",
          background: "#ffffff",
          zIndex: 40,
          boxShadow: "-20px 0 45px rgba(15, 23, 42, 0.18)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "20px", color: "#0f172a" }}>
              Start scan
            </h2>
            <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "14px" }}>
              Launch a background scan job.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: "none",
              background: "#f1f5f9",
              borderRadius: "8px",
              padding: "8px 10px",
              cursor: "pointer",
              color: "#334155",
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            flex: 1,
          }}
        >
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>Target</span>
            <select
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
              style={fieldStyle}
            >
              {targets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name || target.url || `Target #${target.id}`}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>Scan profile</span>
            <select
              value={profile}
              onChange={(event) => setProfile(event.target.value)}
              style={fieldStyle}
            >
              {SCAN_PROFILES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              {selectedProfile?.description}
            </span>
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontWeight: 700, color: "#334155" }}>Tool</span>
            <select
              value={tool}
              onChange={(event) => setTool(event.target.value)}
              style={fieldStyle}
            >
              {TOOLS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              gap: "12px",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "18px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonStyle, background: "#f8fafc", color: "#334155" }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...buttonStyle,
                background: submitting ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
              }}
              disabled={submitting}
            >
              {submitting ? "Starting..." : "Start scan"}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

function ScansPage() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
   
  const [scans, setScans] = useState([]);
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchScans = async () => {
    const response = await fetch(`${API_BASE}/api/Scans`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.title || "Failed to load scans");
    }

    setScans(Array.isArray(data) ? data : data.items || []);
  };

  const fetchTargets = async () => {
    const response = await fetch(`${API_BASE}/api/Targets`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.title || "Failed to load targets");
    }

    setTargets(Array.isArray(data) ? data : data.items || []);
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([fetchScans(), fetchTargets()]);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const hasActiveScan = scans.some((scan) => {
      const status = normalizeStatus(scan);
      return status === "Queued" || status === "Running";
    });

    if (!hasActiveScan) return undefined;

    const interval = setInterval(() => {
      fetchScans().catch((err) => setError(err.message));
    }, 5000);

    return () => clearInterval(interval);
  }, [scans]);

  const startSingleScan = async ({ targetId, profile, tool }) => {
    const response = await fetch(`${API_BASE}/api/Scans/start`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        targetId,
        tool,
        scope: profile,
      }),
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      throw new Error(data.message || data.title || `${tool} scan failed`);
    }

    return data;
  };

  const handleStartScan = async ({ targetId, profile, tool }) => {
    try {
      setSubmitting(true);
      setError("");

      if (tool === "Both") {
        await Promise.all([
          startSingleScan({ targetId, profile, tool: "ZAP" }),
          startSingleScan({ targetId, profile, tool: "Nuclei" }),
        ]);
      } else {
        await startSingleScan({ targetId, profile, tool });
      }

      await fetchScans();
      setDrawerOpen(false);
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        color: "#0f172a",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <button
  onClick={() => navigate("/dashboard")}
  style={{
    border: "none",
    background: "#0f172a",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    marginBottom: "24px",
  }}
>
  ← Back to Dashboard
</button>

        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
          
            <h1 style={{ margin: 0, fontSize: "30px" }}>Scans</h1>
            <p style={{ margin: "8px 0 0", color: "#64748b" }}>
              Review scan history and launch new background scan jobs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              borderRadius: "10px",
              padding: "12px 18px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 18px rgba(37, 99, 235, 0.22)",
            }}
          >
            New scan
          </button>
        </header>

        {error ? (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "12px 14px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        ) : null}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "18px" }}>Scan history</h2>
            <button
              type="button"
              onClick={() => fetchScans().catch((err) => setError(err.message))}
              style={{
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                borderRadius: "8px",
                padding: "8px 12px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Refresh
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "820px",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc", color: "#475569" }}>
                  <th style={thStyle}>Scan ID</th>
                  <th style={thStyle}>Target</th>
                  <th style={thStyle}>Tool</th>
                  <th style={thStyle}>Profile</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Started</th>
                  <th style={thStyle}>Finished</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={emptyStyle}>
                      Loading scans...
                    </td>
                  </tr>
                ) : scans.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={emptyStyle}>
                      No scans found.
                    </td>
                  </tr>
                ) : (
                  scans.map((scan) => {
                    const status = normalizeStatus(scan);

                    return (
                      <tr key={scan.id || scan.scanId} style={{ borderTop: "1px solid #e5e7eb" }}>
                        <td style={tdStyle}>#{scan.id || scan.scanId}</td>
                        <td style={tdStyle}>
                          {scan.targetName || scan.targetUrl || scan.targetId || "—"}
                        </td>
                        <td style={tdStyle}>{scan.tool || "—"}</td>
                        <td style={tdStyle}>{scan.scope || scan.profile || "—"}</td>
                        <td style={tdStyle}>
                          <StatusBadge status={status} />
                        </td>
                        <td style={tdStyle}>{formatDate(scan.startedAt || scan.createdAt)}</td>
                        <td style={tdStyle}>{formatDate(scan.finishedAt || scan.completedAt)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        targets={targets}
        onStartScan={handleStartScan}
        submitting={submitting}
      />
    </div>
  );
}

const fieldStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle = {
  flex: 1,
  border: "none",
  borderRadius: "9px",
  padding: "12px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

const thStyle = {
  textAlign: "left",
  padding: "13px 16px",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle = {
  padding: "15px 16px",
  fontSize: "14px",
  color: "#334155",
  verticalAlign: "middle",
};

const emptyStyle = {
  padding: "34px 16px",
  textAlign: "center",
  color: "#64748b",
};

export default ScansPage;
