import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  
  const handleLogin = async () => {
  try {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const response = await fetch("/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log("Login response:", data);

    // 👇 adjust if your backend uses a different key
    const token = data.token;

    if (!token) {
      throw new Error("No token returned from API");
    }

    // ✅ store real token
    localStorage.setItem("token", token);

    // ✅ go to dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    alert(error.message || "Login failed");
  }
};
  

  return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(to right, #e2e8f0, #f8fafc)"
    }}
  >
    <div
      style={{
        background: "white",
  padding: "35px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  width: "320px",
  textAlign: "center"
      }}
    >
      <h2 style={{
  marginBottom: "25px",
  color: "#0f172a",
  fontWeight: "600"
}}>
  Welcome Back
</h2>
      <input
        type="email"
        placeholder="Enter email"
        onFocus={(e) => e.target.style.border = "1px solid #2563eb"}
onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
        style={{
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  outline: "none"
}}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onFocus={(e) => e.target.style.border = "1px solid #2563eb"}
onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
        style={{
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
  outline: "none"
}}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
  onClick={handleLogin}
  style={{
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s"
  }}
  onMouseOver={(e) => e.target.style.background = "#1d4ed8"}
  onMouseOut={(e) => e.target.style.background = "#2563eb"}
>
  Login
</button>
    </div>
  </div>
);
}

export default Login;