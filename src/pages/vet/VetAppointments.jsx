import React, { useEffect, useState } from "react";
import { getVetAppointments } from "../../api/vetMock.js";

export default function VetAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getVetAppointments().then(data => setAppointments(data));
  }, []);

  return (
    <div className="container py-4">
      <h2>Appointments</h2>
      <ul className="list-group">
        {appointments.map(app => (
          <li key={app.id} className="list-group-item">
            <strong>{app.petName}</strong> with {app.owner}  
            <span className="badge bg-primary mx-2">{app.date}</span>  
            <em>{app.reason}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
