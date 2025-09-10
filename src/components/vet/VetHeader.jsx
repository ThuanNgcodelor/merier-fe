// src/components/vet/VetHeader.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function VetHeader() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/vet">
          🐾 Vet Portal
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#vetNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="vetNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/vet" end className="nav-link">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/appointments" className="nav-link">
                Appointments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/records" className="nav-link">
                Health Records
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/articles" className="nav-link">
                Articles
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/vet/profile" className="nav-link">
                Profile
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/information" className="nav-link">
                My Account
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}