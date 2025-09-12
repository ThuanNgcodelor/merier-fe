import React, { useEffect, useMemo, useState } from "react";
import { fetchAllVets, searchVets, getVetById } from "../../../api/vet.js";
import { getMyPets } from "../../../api/user.js";
import { createAppointment } from "../../../api/appointments.js";
import defaultVetImage from "../../../assets/images/photos/about3.jpg";

const VetCard = ({ vet, onBook }) => {
    return (
        <div className="col-12 col-sm-6 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm" style={{ borderRadius: 16 }}>
                <img
                    src={vet.image || defaultVetImage}
                    alt={vet.name || vet.fullName || "Vet"}
                    className="card-img-top"
                    style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, objectFit: "cover", height: 160 }}
                />
                <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold mb-1"><span style={{ marginRight: 6 }}>🩺</span>{vet.specialization || "Veterinarian"}</h6>
                    <div className="text-muted small mb-1">{vet.specialization || vet.speciality || "General"}</div>
                    <div className="small text-muted"><span style={{ marginRight: 6 }}>📍</span>{vet.address || vet.clinicAddress || ""}</div>
                    <div className="d-flex align-items-center justify-content-between mt-3">
                        <span className="badge text-bg-light">{vet.yearsExperience || vet.experience || 0} yrs exp.</span>
                    </div>
                    <button className="btn btn-primary btn-sm mt-3" onClick={() => onBook(vet)}>
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AllVets() {
    const [loading, setLoading] = useState(true);
    const [allVets, setAllVets] = useState([]);
    const [vets, setVets] = useState([]);
    const [query, setQuery] = useState("");
    const [province, setProvince] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [selectedVet, setSelectedVet] = useState(null);
    const [pets, setPets] = useState([]);

    const hasFilters = useMemo(
        () => !!(query || province || specialization),
        [query, province, specialization]
    );

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchAllVets();
                const list = Array.isArray(data) ? data : [];
                if (active) {
                    setAllVets(list);
                    setVets(list);
                }
            } catch {
                if (active) {
                    setAllVets([]);
                    setVets([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!loading && !hasFilters) {
            setVets(allVets);
        }
    }, [hasFilters, loading, allVets]);

    const doSearch = async (e) => {
        e?.preventDefault?.();
        if (!hasFilters) {
            setVets(allVets);
            return;
        }
        try {
            setLoading(true);
            const data = await searchVets({
                q: query || undefined,
                province: province || undefined,
                specialization: specialization || undefined,
            });
            setVets(Array.isArray(data) ? data : []);
        } catch {
            setVets([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setQuery("");
        setProvince("");
        setSpecialization("");
        setVets(allVets);
    };

    const handleBookClick = async (vet) => {
        try {
            setLoading(true);
            const vetId = vet?.userId;
            if (vetId) {
                const full = await getVetById(vetId);
                setSelectedVet(full || vet);
            } else {
                setSelectedVet(vet);
            }
            
            try {
                const data = await getMyPets();
                setPets(Array.isArray(data) ? data : []);
            } catch (e) {
                setPets([]);
            }
        } catch (e) {
            setSelectedVet(vet);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        const petId = form.get("petId");
        const petName = pets.find(p => p.id === petId)?.name || "Unknown Pet";
        const reason = form.get("reason");
        const date = form.get("date");
        const time = form.get("time");
        
        if (!petId || !date || !time) {
            alert("Please fill all required fields.");
            return;
        }
        
        try {
            const startDateTime = new Date(`${date}T${time}:00`);
            const endDateTime = new Date(`${date}T${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}:00`);
            
            const bookingData = {
                petId: petId,
                vetId: selectedVet.userId,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                reason: reason || "Vet appointment"
            };
            await createAppointment(bookingData);
            alert(
                `Successfully booked ${selectedVet.specialization || 'Veterinarian'} for ${petName} on ${date} at ${time}\nReason: ${reason}`
            );
            setSelectedVet(null);
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.response?.data?.error || "Failed to book appointment. Please try again.";
            alert(`Error: ${errorMessage}`);
        }
    };


    if (loading) return <div className="text-center">Loading vets...</div>;

    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="section-title text-center">
                    <h2 className="title">Find a Veterinarian</h2>
                    <p>Search and book an appointment.</p>
                </div>

                <form className="mb-4" onSubmit={doSearch}>
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, clinic..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Specialization"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 mb-2 d-flex">
                            <button type="submit" className="btn btn-primary mr-2" style={{ marginRight: 8 }}>
                                Search
                            </button>
                            {hasFilters && (
                                <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="row">
                    {vets.map((v) => (
                        <VetCard key={v.userId || v.id || v.vetId} vet={v} onBook={handleBookClick} />
                    ))}
                    {vets.length === 0 && (
                        <div className="col-12 text-center">No vets found.</div>
                    )}
                </div>
            </div>

            {selectedVet && (
                <div className="vf-backdrop">
                    <div className="vf-modal p-4 bg-white rounded shadow">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="m-0">Book Appointment</h5>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedVet(null)}>✕</button>
                        </div>
                        <div className="mb-2 text-muted small">
                            {selectedVet.specialization || 'Veterinarian'} — {selectedVet.clinicAddress || 'Clinic'}
                            <br />
                            {selectedVet.clinicAddress}
                        </div>
                        <form onSubmit={handleBookSubmit}>
                            <div className="mb-2">
                                <label className="form-label">Pet</label>
                                <select name="petId" className="form-control" required>
                                    <option value="">Select your pet</option>
                                    {pets.map((pet) => (
                                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Reason</label>
                                <input name="reason" className="form-control" placeholder="Vaccination" required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Date</label>
                                <input type="date" name="date" className="form-control" required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Time</label>
                                <input type="time" name="time" className="form-control" required />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedVet(null)}>Cancel</button>
                                <button type="submit" className="btn btn-success">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

// Inline styles for modal (scoped)
const style = document.createElement("style");
style.innerHTML = `
.vf-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.vf-modal{max-width:420px;width:100%}
`;
document.head.appendChild(style);
