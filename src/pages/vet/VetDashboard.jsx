import React from "react";

export default function VetDashboard() {
  return (
    <div className="container py-4">
      <h2>Vet Dashboard</h2>
      <p>Welcome back, Dr. Emily Carter 👩‍⚕️</p>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Today’s Appointments</h5>
            <p>3 appointments scheduled</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Health Records</h5>
            <p>45 records updated</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h5>Articles Published</h5>
            <p>12 total articles</p>
          </div>
        </div>
      </div>
    </div>
  );
}
