import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function VetHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">

        <NavLink className="navbar-brand fw-bold" to="/vet" onClick={close}>
          🐾 Vet Portal
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="vetNavbar"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggle}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="vetNavbar"
          className={`collapse navbar-collapse ${open ? "show" : ""}`}
        >
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/vet" end className="nav-link" onClick={close}>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/appointments" className="nav-link" onClick={close}>
                Appointments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/records" className="nav-link" onClick={close}>
                Health Records
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/articles" className="nav-link" onClick={close}>
                Articles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/profile" className="nav-link" onClick={close}>
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/information" className="nav-link" onClick={close}>
                My Account
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
