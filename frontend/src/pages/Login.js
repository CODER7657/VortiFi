import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Create this CSS file

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "admin123") {
      onLogin(true);
      navigate("/admin");
    } else {
      setError("❌ Incorrect password. Try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>🔐 Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

