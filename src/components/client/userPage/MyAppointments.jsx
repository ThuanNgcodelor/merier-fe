import React, { useEffect, useState } from "react";
import { getMyAppointments } from "../../../api/user.js";
import { listMyPets } from "../../../api/pet.js";

export default function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [petMap, setPetMap] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const [appts, pets] = await Promise.all([
                    getMyAppointments(),
                    listMyPets()
                ]);
                setAppointments(appts);
                // Tạo map petId -> petName
                const map = {};
                pets.forEach(p => { map[p.id] = p.name; });
                setPetMap(map);
            } catch (err) {
                setError(err.message || "Không thể tải lịch hẹn");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Loading appointments...</div>;
    if (error) return <div>{error}</div>;
    if (!appointments.length) return <div>You have no appointments.</div>;

    return (
        <div className="myaccount-content">
            <h3>My Appointments</h3>
            <div className="table-responsive">
                <table className="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>Pet</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Status</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((a) => (
                            <tr key={a.id}>
                                <td>{petMap[a.petId] || a.petId}</td>
                                <td>{new Date(a.startTime).toLocaleString()}</td>
                                <td>{new Date(a.endTime).toLocaleString()}</td>
                                <td>{a.status}</td>
                                <td>{a.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}