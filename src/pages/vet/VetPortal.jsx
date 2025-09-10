// src/pages/vet/VetPortal.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import VetHeader from "../../components/vet/VetHeader.jsx";

export default function VetPortal() {
  return (
    <div>
        <VetHeader />
      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
