import React, { useEffect, useState } from "react";
import { getMyPets } from "../../../api/user.js";
import { createAppointment } from "../../../api/appointments.js";

export default function BookAppointmentModal({ isOpen, onClose, vet }) {
    const [pets, setPets] = useState([]);
    const [form, setForm] = useState({
        petId: "",
        date: "",
        startTime: "",
        endTime: "",
        reason: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (!isOpen) return;
        (async () => {
            try {
                const data = await getMyPets();
                setPets(Array.isArray(data) ? data : []);
            } catch (e) {
                setPets([]);
            }
        })();
    }, [isOpen]);

    const reset = () => {
        setForm({ petId: "", date: "", startTime: "", endTime: "", reason: "" });
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.petId || !form.date || !form.startTime || !form.endTime) {
            setError("Please fill all required fields.");
            return;
        }
        const start = new Date(`${form.date}T${form.startTime}`);
        const end = new Date(`${form.date}T${form.endTime}`);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            setError("Invalid time range.");
            return;
        }
        setSubmitting(true);
        try {
            await createAppointment({
                petId: form.petId,
                vetId: vet?.userId, // Backend uses userId as the primary ID for vets
                startTime: start.toISOString(),
                endTime: end.toISOString(),
                reason: form.reason?.trim() || "Vet appointment",
            });
            setSuccess("Appointment booked successfully!");
            setTimeout(() => {
                setSubmitting(false);
                reset();
                onClose?.();
            }, 800);
        } catch (err) {
            setSubmitting(false);
            const msg = err?.response?.data?.message || "Failed to book appointment.";
            setError(msg);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Book appointment {vet?.specialization ? `with ${vet.specialization}` : ""}</h5>
                        <button type="button" className="close" onClick={() => { reset(); onClose?.(); }}>
                            <span>×</span>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <div className="form-group">
                                <label>Pet</label>
                                <select
                                    name="petId"
                                    className="form-control"
                                    value={form.petId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select your pet</option>
                                    {pets.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group col-6">
                                    <label>Start time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        className="form-control"
                                        value={form.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group col-6">
                                    <label>End time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        className="form-control"
                                        value={form.endTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Reason</label>
                                <textarea
                                    name="reason"
                                    className="form-control"
                                    rows="3"
                                    value={form.reason}
                                    onChange={handleChange}
                                    placeholder="Describe the reason"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => { reset(); onClose?.(); }}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? "Booking..." : "Book"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}