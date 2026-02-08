import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [passcodeMsg, setPasscodeMsg] = useState("");

  // Fetch service requests
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/adm/dashboard", {
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error");
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  // Delete a request
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/service/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (res.ok || res.status === 200) {
        setRequests(requests.filter((r) => r._id !== id));
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Server connection error");
    }
  };

  // Change passcode
  const handleChangePasscode = async () => {
    if (!newPasscode) return;
    try {
      const res = await fetch("http://localhost:5000/admin/change-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPasscode }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasscodeMsg(data.message);
        setNewPasscode("");
      } else {
        setPasscodeMsg(data.error);
      }
    } catch (err) {
      console.error(err);
      setPasscodeMsg("Server error");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Passcode Change */}
      <div className="passcode-change">
        <input
          type="password"
          placeholder="Enter new passcode"
          value={newPasscode}
          onChange={(e) => setNewPasscode(e.target.value)}
        />
        <button onClick={handleChangePasscode}>Change Passcode</button>
        {passcodeMsg && <p className="passcode-msg">{passcodeMsg}</p>}
      </div>

      {error && <p className="error">{error}</p>}

      {/* Orders Cards */}
      <div className="orders-container">
        {requests.map((r) => (
          <div className="order-card" key={r._id}>
            <p><strong>Nom:</strong> {r.name}</p>
            <p><strong>Téléphone:</strong> {r.phone}</p>
            <p><strong>Adresse:</strong> {r.address}</p>
            <p><strong>Voiture:</strong> {r.carType}</p>
            <p><strong>Modèle:</strong> {r.carModel}</p>
            <p><strong>Moteur:</strong> {r.engine}</p>
            <p><strong>Huile:</strong> {r.oilType}</p>
            <button onClick={() => handleDelete(r._id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
