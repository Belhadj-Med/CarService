import { useState } from "react";
import "./AdminLogin.css";
import { BACKEND_URL } from "../config";
const AdminLogin = ({ setToken }) => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();

      if (res.ok) {
        // Save token in localStorage or state
        
        localStorage.setItem("adminToken", data.token);
        setToken(data.token); 
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Enter passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
