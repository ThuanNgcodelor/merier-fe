import React, { useEffect, useMemo, useState } from "react";
import { fetchAllVets, searchVets, getVetById } from "../../api/vet.js";
import { getMyPets } from "../../api/user.js";
import { createAppointment } from "../../api/appointments.js";

// Card
function VetCard({ vet, onBook }) {
  return (
    <div className="card shadow-sm p-3 m-2" style={{ borderRadius: "16px" }}>
      <div className="text-center">
        <img
          src={vet.image || "https://via.placeholder.com/200x150?text=Vet"}
          alt={vet.name || vet.fullName || "Vet"}
          className="img-fluid mb-2"
        />
      </div>
      <h5 className="fw-bold">{vet.specialization || "Veterinarian"}</h5>
      <p className="text-muted mb-1">{vet.specialization || vet.speciality}</p>
      <p className="small mb-1">{vet.clinic || vet.clinicName}</p>
      <p className="small">{vet.address}</p>
      <p>
        <strong>${vet.price ?? vet.fee ?? 0}</strong> — {(vet.yearsExperience ?? vet.experience ?? 0)} yrs exp.
      </p>
      <button className="btn btn-primary btn-sm" onClick={() => onBook(vet)}>
        Book Appointment
      </button>
    </div>
  );
}

// Modal
function BookingModal({ vet, onClose }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!vet) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getMyPets();
        setPets(Array.isArray(data) ? data : []);
      } catch (e) {
        setPets([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [vet]);

  if (!vet) return null;

  const handleSubmit = async (e) => {
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
      // Create booking data in the format backend expects
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(`${date}T${String(parseInt(time.split(':')[0]) + 1).padStart(2, '0')}:${time.split(':')[1]}:00`);
      
      const bookingData = {
        petId: petId,
        vetId: vet.userId, // Backend uses userId as the primary ID for vets
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason: reason || "Vet appointment"
      };
      
      console.log("Sending booking data:", bookingData);
      
      // Call API to create appointment
      await createAppointment(bookingData);
      
      alert(
        `Successfully booked ${vet.specialization || 'Veterinarian'} for ${petName} on ${date} at ${time}\nReason: ${reason}`
      );
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      const errorMessage = error?.response?.data?.message || "Failed to book appointment. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="vf-backdrop">
      <div className="vf-modal p-4 bg-white rounded shadow">
        <h4 className="mb-3">Book Appointment with {vet.specialization || "Veterinarian"}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Pet</label>
            <select name="petId" className="form-control" required>
              <option value="">Select your pet</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
            {loading && <small className="text-muted">Loading pets...</small>}
          </div>
          <div className="mb-2">
            <label className="form-label">Reason</label>
            <input name="reason" className="form-control" required />
          </div>
          <div className="mb-2">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Time</label>
            <input type="time" name="time" className="form-control" required />
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Component
export default function VetFinder() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedVet, setSelectedVet] = useState(null);
  const [error, setError] = useState("");

  const hasFilters = useMemo(() => q || province || specialization, [q, province, specialization]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllVets();
        if (!ignore) setList(Array.isArray(data) ? data : data?.content || []);
      } catch (e) {
        if (!ignore) setError("Failed to load vets.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    try {
      setLoading(true);
      setError("");
      if (hasFilters) {
        const data = await searchVets({ q, province, specialization });
        setList(Array.isArray(data) ? data : data?.content || []);
      } else {
        const data = await fetchAllVets();
        setList(Array.isArray(data) ? data : data?.content || []);
      }
    } catch (e) {
      setError("Failed to search vets.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = async (vet) => {
    try {
      setLoading(true);
      setError("");
      // Use userId as the primary ID for vets (from backend VetProfileDto)
      const vetId = vet?.userId;
      if (vetId) {
        const full = await getVetById(vetId);
        setSelectedVet(full || vet);
      } else {
        setSelectedVet(vet);
      }
    } catch (e) {
      setError("Failed to load vet details.");
      setSelectedVet(vet); // fallback to basic card data
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="mb-3">Find a Vet</h3>

      <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
        <div className="col-12 col-md-4">
          <label className="form-label">Search</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control"
            placeholder="Name, clinic, etc."
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">Province</label>
          <input
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="form-control"
            placeholder="Province"
          />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">Specialization</label>
          <input
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="form-control"
            placeholder="e.g. Surgery"
          />
        </div>
        <div className="col-12 col-md-2 d-grid">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Find"}
          </button>
        </div>
      </form>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row">
        {list?.length === 0 && !loading && <div className="text-muted px-3">No vets found.</div>}
        {list?.map((vet) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={vet.id ?? vet.vetId ?? vet.vetUserId ?? vet.userId}>
            <VetCard vet={vet} onBook={handleBookClick} />
          </div>
        ))}
      </div>

      {selectedVet && (
        <BookingModal vet={selectedVet} onClose={() => setSelectedVet(null)} />
      )}
    </div>
  );
}

// Inline styles for modal (scoped)
const style = document.createElement("style");
style.innerHTML = `
.vf-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.vf-modal{max-width:420px;width:100%}
`;
document.head.appendChild(style);
