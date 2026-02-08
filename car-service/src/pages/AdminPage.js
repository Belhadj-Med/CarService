import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

const AdminPage = () => {
  const [token, setToken] = useState(null);

  return (
    <div>
      {token!=null ? (
        <AdminDashboard token={token} />
      ) : (
        <AdminLogin setToken={setToken} />
      )}
    </div>
  );
};

export default AdminPage;
