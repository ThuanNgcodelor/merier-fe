import React, { useEffect, useMemo, useState } from "react";
import { fetchAllVets, searchVets, getVetById } from "../../api/vet.js";
import { getMyPets, createDefaultAddressForTest, checkDefaultAddress } from "../../api/user.js";
import { createAppointment } from "../../api/appointments.js";
import defaultVetImage from "../../assets/images/photos/about3.jpg";

// Card
function VetCard({ vet, onBook }) {
  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm" style={{ borderRadius: 16 }}>
        <img
          src={vet.image || vet.vetImage || defaultVetImage}
          alt={vet.vetName || vet.name || vet.fullName || "Vet"}
          className="card-img-top"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, objectFit: "cover", height: 160 }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="fw-bold mb-1">
            <span style={{ marginRight: 6 }}>🩺</span>
            {vet.vetName || vet.name || vet.fullName || "Unknown Vet"}
          </h6>
          <div className="text-muted small mb-1">
            <strong>Specialization:</strong> {vet.specialization || vet.speciality || "General"}
          </div>
          <div className="small text-muted mb-1">
            <span style={{ marginRight: 6 }}>📍</span>
            {vet.clinicAddress || vet.address || vet.clinic || vet.clinicName || "No address"}
          </div>
          {vet.clinicLocation && (
            <div className="small text-muted mb-1">
              <span style={{ marginRight: 6 }}>🏙️</span>
              {vet.clinicLocation.city}, {vet.clinicLocation.district}
            </div>
          )}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge text-bg-light">
              {vet.yearsExperience || vet.experience || 0} yrs exp.
            </span>
            {vet.distance !== undefined && (
              <span className="badge text-bg-primary">
                📏 {vet.distance.toFixed(1)} km
              </span>
            )}
          </div>
          <div className="small text-muted mb-2">
            <span style={{ marginRight: 6 }}>📞</span>
            {vet.vetPhone || vet.phone || "N/A"}
          </div>
          {vet.bio && (
            <div className="small text-muted mb-2" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {vet.bio}
            </div>
          )}
          <button className="btn btn-primary btn-sm mt-auto" onClick={() => onBook(vet)}>
            Book Appointment
          </button>
        </div>
      </div>
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
  const [hasDefaultAddress, setHasDefaultAddress] = useState(false);
  const [addressMessage, setAddressMessage] = useState("");

  const hasFilters = useMemo(() => q || province || specialization, [q, province, specialization]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllVets();
        if (!ignore) setList(Array.isArray(data) ? data : data?.content || []);
        
        // Check default address status
        const addressStatus = await checkDefaultAddress();
        if (!ignore) {
          setHasDefaultAddress(addressStatus.hasDefaultAddress);
          setAddressMessage(addressStatus.message);
        }
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

  const handleCreateDefaultAddress = async () => {
    try {
      setLoading(true);
      const result = await createDefaultAddressForTest();
      if (result.success) {
        setHasDefaultAddress(true);
        setAddressMessage(result.message);
        alert("✅ " + result.message + "\n📍 Address: " + result.address);
      } else {
        alert("ℹ️ " + result.message);
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="product-area section-space">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="title">Find Veterinarians</h2>
          <p>Search for veterinarians by name, location, or specialization and book appointments.</p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">🔍 Search Filters</h5>
            
            {/* Address Status */}
            {!hasDefaultAddress && (
              <div className="alert alert-warning mb-3">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <strong>⚠️ No Default Address</strong>
                    <p className="mb-0 small">{addressMessage}</p>
                  </div>
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={handleCreateDefaultAddress}
                    disabled={loading}
                  >
                    🏠 Create Test Address
                  </button>
                </div>
              </div>
            )}
            
            {hasDefaultAddress && (
              <div className="alert alert-success mb-3">
                <strong>✅ Default Address Ready</strong>
                <p className="mb-0 small">{addressMessage}</p>
              </div>
            )}
            
            <form className="row g-2 align-items-end" onSubmit={handleSearch}>
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
                  {loading ? "Loading..." : "🔍 Find Vets"}
                </button>
              </div>
            </form>
          </div>
        </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading veterinarians...</p>
        </div>
      )}

      {!loading && list?.length === 0 && (
        <div className="text-center py-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-5">
              <div className="mb-4">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>No veterinarians found</h5>
                <p className="text-muted">Try adjusting your search criteria or filters</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && list?.length > 0 && (
        <div className="row">
          {list.map((vet) => (
            <VetCard key={vet.id ?? vet.vetId ?? vet.vetUserId ?? vet.userId} vet={vet} onBook={handleBookClick} />
          ))}
        </div>
      )}

        {selectedVet && (
          <BookingModal vet={selectedVet} onClose={() => setSelectedVet(null)} />
        )}
      </div>
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
