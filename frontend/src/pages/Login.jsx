import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!email || !password) {
        throw new Error("Please fill all fields");
      }
      if (mode === "register" && !fullName) {
  throw new Error("Please enter full name");
}

      if (
        mode === "register" &&
        password !== confirmPassword
      ) {
        throw new Error("Passwords do not match");
      }

      const endpoint =
        mode === "login"
          ? "/api/Auth/login"
          : "/api/Auth/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
  mode === "login"
    ? {
        email,
        password,
      }
    : {
        fullName,
        email,
        password,
      }
),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.title ||
            "Authentication failed"
        );
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (mode === "login") {
  navigate("/dashboard");
} else {
  alert("Registration successful. Please login.");
  setMode("login");

  setFullName("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
}
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "10px",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "linear-gradient(to right, #e2e8f0, #f8fafc)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
          width: "340px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            marginBottom: "10px",
            color: "#0f172a",
            fontWeight: "600",
          }}
        >
          {mode === "login"
            ? "Welcome Back"
            : "Create Account"}
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            marginBottom: "20px",
          }}
        >
          {mode === "login"
            ? "Login to continue"
            : "Register to continue"}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              background:
                mode === "login"
                  ? "#2563eb"
                  : "#e2e8f0",
              color:
                mode === "login"
                  ? "white"
                  : "#0f172a",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              background:
                mode === "register"
                  ? "#2563eb"
                  : "#e2e8f0",
              color:
                mode === "register"
                  ? "white"
                  : "#0f172a",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontSize: "13px",
              marginBottom: "10px",
            }}
          >
            {error}
          </div>
        )}

        {mode === "register" && (
  <input
    type="text"
    placeholder="Enter full name"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    style={inputStyle}
  />
)}

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {mode === "register" && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            style={inputStyle}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Login;