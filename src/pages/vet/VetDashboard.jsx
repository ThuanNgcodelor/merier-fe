import React, { useEffect, useMemo, useState, useContext } from "react";
import { getVetAppointments, getPetHealthRecords } from "../../api/appointments.js";

const AuthContext = React.createContext(null);

const sameDay = (a, b) => {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
         da.getMonth() === db.getMonth() &&
         da.getDate() === db.getDate();
};
const daysDiff = (a, b) => Math.floor((new Date(a) - new Date(b)) / (1000*60*60*24));

export default function VetDashboard() {
  const auth = useContext(AuthContext); // optional
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [recordsTotal, setRecordsTotal] = useState(0);
  const [recordsLast7d, setRecordsLast7d] = useState(0);

  // Lấy tên hiển thị từ context hoặc localStorage
  const currentUserName = useMemo(() => {
    if (auth?.user?.username || auth?.user?.fullName) return auth.user.fullName || auth.user.username;
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return "Doctor";
      const u = JSON.parse(raw);
      return u.fullName || u.username || "Doctor";
    } catch { return "Doctor"; }
  }, [auth]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const apps = await getVetAppointments();
      const list = Array.isArray(apps) ? apps : [];
      setAppointments(list);

      // Lấy health records cho các pet xuất hiện trong lịch hẹn
      const petIds = Array.from(new Set(list.map(a => a.petId).filter(Boolean)));
      if (petIds.length) {
        const batches = await Promise.all(
          petIds.map(id => getPetHealthRecords(id).catch(() => []))
        );
        const recs = batches.flat().filter(Boolean);
        setRecordsTotal(recs.length);

        const now = new Date();
        const last7 = recs.filter(r => {
          if (!r?.visitTime) return false;
          const d = new Date(r.visitTime);
          const diff = (now - d) / (1000*60*60*24);
          return diff <= 7 && diff >= 0;
        });
        setRecordsLast7d(last7.length);
      } else {
        setRecordsTotal(0);
        setRecordsLast7d(0);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const today = new Date();
  const todayCount = useMemo(
    () => appointments.filter(a => sameDay(a.startTime, today)).length,
    [appointments]
  );
  const pendingCount = useMemo(
    () => appointments.filter(a => (a.status || "").toUpperCase() === "PENDING").length,
    [appointments]
  );
  const doneToday = useMemo(
    () => appointments.filter(a => (a.status || "").toUpperCase() === "DONE" && sameDay(a.endTime || a.startTime, today)).length,
    [appointments]
  );

  if (loading) return <div className="container py-4">Loading dashboard…</div>;
  if (error)   return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <h2>Vet Dashboard</h2>
      <p>Welcome back, {currentUserName} 👩‍⚕️</p>

      <div className="row mt-4 g-3">
        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Today’s Appointments</h5>
            <p className="display-6 m-0">{todayCount}</p>
            <small className="text-muted">Scheduled for today</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Pending</h5>
            <p className="display-6 m-0">{pendingCount}</p>
            <small className="text-muted">Awaiting confirmation</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Completed Today</h5>
            <p className="display-6 m-0">{doneToday}</p>
            <small className="text-muted">Marked as DONE</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm p-3">
            <h5 className="mb-1">Health Records</h5>
            <p className="display-6 m-0">{recordsTotal}</p>
            <small className="text-muted">{recordsLast7d} updated in last 7 days</small>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button className="btn btn-outline-secondary btn-sm" onClick={load}>Refresh</button>
      </div>
    </div>
  );
}
