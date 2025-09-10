import React, { useEffect, useState } from "react";
import { getVetHealthRecords } from "../../api/vetMock.js";

export default function VetHealthRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getVetHealthRecords().then(data => setRecords(data));
  }, []);

  return (
    <div className="container py-4">
      <h2>Health Records</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Record</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.petName}</td>
              <td>{r.record}</td>
              <td>{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
