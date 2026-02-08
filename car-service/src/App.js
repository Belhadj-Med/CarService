import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
 
import AdminPage from "./pages/AdminPage"; 
import Contact from "./pages/Contact";
import Service from "./pages/Service";
import Apropos from "./pages/Apropos";
import logo from "./imgs/logo.png";  
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <Router>
      <nav className="header">
      <Link to="/">
  <img src={logo} className="logo" alt="logo" style={{ cursor: "pointer" }} />
</Link>

<div className="nav-links">

  <Link to="/apropos">À propos</Link>
  <Link to="/contact">Contact</Link>
  <Link to="/service">Service</Link>
</div>

      </nav>

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/apropos" element={<Apropos />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/service" element={<Service />} />
  <Route path="/adm" element={<AdminPage />} />
</Routes>
    </Router>
  );
}

export default App;
