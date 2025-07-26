import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./pages/Login";
import VotingPage from "./pages/VotingPage";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isAdmin");
    const time = localStorage.getItem("loginTime");
    const expired = 15 * 60 * 1000;

    if (stored === "true" && Date.now() - time < expired) {
      setIsAdmin(true);
    } else {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("loginTime");
    }
  }, []);

  const handleLogin = (value) => {
    setIsAdmin(value);
    localStorage.setItem("isAdmin", value);
    localStorage.setItem("loginTime", Date.now());
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={styles.navbar}>
        <div style={styles.links}>
          <Link style={styles.link} to="/vote">🗳️ Vote</Link>
          {!isAdmin && <Link style={styles.link} to="/">🔐 Admin Login</Link>}
          {isAdmin && <Link style={styles.link} to="/admin">🛠️ Admin Panel</Link>}
        </div>
        {isAdmin && (
          <button style={styles.logout} onClick={handleLogout}>🔓 Logout</button>
        )}
      </div>

      <Routes>
        <Route path="/" element={isAdmin ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />} />
        <Route path="/vote" element={<VotingPage />} />
        <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/vote" />} />
      </Routes>
    </Router>
  );
}

const styles = {
  navbar: {
    backgroundColor: "#222",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  links: {
    display: "flex",
    gap: "1rem",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
  },
  logout: {
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;
