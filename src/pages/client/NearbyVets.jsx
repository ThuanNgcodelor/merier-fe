import React, { useState } from "react";
import { getVetById } from "../../api/vet.js";
import { getMyPets } from "../../api/user.js";
import { createAppointment } from "../../api/appointments.js";
import LocationSearch from "../../components/client/LocationSearch";
import defaultVetImage from "../../assets/images/photos/about3.jpg";
import Swal from "sweetalert2";

const VetCard = ({ vet, onBook }) => {
  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm" style={{ borderRadius: 16 }}>
        <img
          src={vet.image || defaultVetImage}
          alt={vet.vetName || "Vet"}
          className="card-img-top"
          style={{
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            objectFit: "cover",
            height: 160,
          }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="fw-bold mb-1">
            <span style={{ marginRight: 6 }}>🩺</span>
            {vet.vetName || "Unknown Vet"}
          </h6>
          <div className="text-muted small mb-1">
            <strong>Specialization:</strong> {vet.specialization || "General"}
          </div>
          <div className="small text-muted mb-1">
            <span style={{ marginRight: 6 }}>📍</span>
            {vet.clinicAddress || "No address"}
          </div>
          {vet.clinicLocation && (
            <div className="small text-muted mb-1">
              <span style={{ marginRight: 6 }}>🏙️</span>
              {vet.clinicLocation.city}, {vet.clinicLocation.district}
            </div>
          )}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="badge text-bg-light">
              {vet.yearsExperience || 0} yrs exp.
            </span>
            {vet.distance !== undefined && (
              <span className="badge text-bg-primary">
                📏 {vet.distance.toFixed(1)} km
              </span>
            )}
          </div>
          <div className="small text-muted mb-2">
            <span style={{ marginRight: 6 }}>📞</span>
            {vet.vetPhone || "N/A"}
          </div>
          {vet.bio && (
            <div
              className="small text-muted mb-2"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {vet.bio}
            </div>
          )}
          <button
            className="btn btn-primary btn-sm mt-auto"
            onClick={() => onBook(vet)}
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default function NearbyVets() {
  const [vets, setVets] = useState([]);
  const [showSearch, setShowSearch] = useState(true);
  const [selectedVet, setSelectedVet] = useState(null);
  const [pets, setPets] = useState([]);
  const [, setLoading] = useState(false);

  // Small toast helper
  const toast = (icon, title) =>
    Swal.fire({
      toast: true,
      icon,
      title,
      position: "top-end",
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    });

  const handleResults = (results) => {
    setVets(results);
    setShowSearch(false);
  };

  const resetSearch = () => {
    setVets([]);
    setShowSearch(true);
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
      } catch {
        setPets([]);
      }
    } catch {
      setSelectedVet(vet);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const petId = form.get("petId");
    const petName = pets.find((p) => p.id === petId)?.name || "Unknown Pet";
    const reason = form.get("reason");
    const date = form.get("date");
    const time = form.get("time");

    if (!petId || !date || !time) {
      await Swal.fire({
        title: "Missing information",
        text: "Please fill all required fields (Pet, Date, Time).",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(
        `${date}T${String(parseInt(time.split(":")[0]) + 1).padStart(2, "0")}:${
          time.split(":")[1]
        }:00`
      );

      const bookingData = {
        petId: petId,
        vetId: selectedVet.userId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason: reason || "Vet appointment",
      };

      // Loading popup while booking
      Swal.fire({
        title: "Booking appointment...",
        text: "Please wait a moment",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      await createAppointment(bookingData);

      Swal.close();
      await Swal.fire({
        title: "Appointment booked ✅",
        html: `
          <div style="text-align:left">
            <div><b>Veterinarian:</b> ${
              selectedVet.specialization || "Veterinarian"
            }</div>
            <div><b>Pet:</b> ${petName}</div>
            <div><b>Date & Time:</b> ${date} ${time}</div>
            <div><b>Reason:</b> ${reason}</div>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Done",
      });

      setSelectedVet(null);
      toast("success", "Booking created");
    } catch (error) {
      Swal.close();
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to book appointment. Please try again.";

      await Swal.fire({
        title: "Booking failed",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Try again",
      });
    }
  };

  return (
    <section className="product-area section-space">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="title">Find Nearby Veterinarians</h2>
          <p>
            Search for veterinarians near your location and book appointments.
          </p>
        </div>

        {showSearch ? (
          <LocationSearch type="vets" onResults={handleResults} />
        ) : (
          <div className="results-section">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">
                      Found {vets.length} veterinarians nearby
                    </h4>
                    <p className="text-muted mb-0">
                      Search results based on your location
                    </p>
                  </div>
                  <button
                    onClick={resetSearch}
                    className="btn btn-outline-primary"
                  >
                    🔍 New Search
                  </button>
                </div>
              </div>
            </div>

            {vets.length > 0 ? (
              <div className="row">
                {vets.map((vet) => (
                  <VetCard
                    key={vet.userId}
                    vet={vet}
                    onBook={handleBookClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-5">
                    <div className="mb-4">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <h5>No veterinarians found</h5>
                      <p className="text-muted">
                        Try increasing the search radius or using a different
                        location
                      </p>
                    </div>
                    <button onClick={resetSearch} className="btn btn-primary">
                      🔄 Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {selectedVet && (
        <div className="vf-backdrop">
          <div className="vf-modal p-4 bg-white rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Book Appointment</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSelectedVet(null)}
              >
                ✕
              </button>
            </div>
            <div className="mb-2 text-muted small">
              {selectedVet.specialization || "Veterinarian"} —{" "}
              {selectedVet.clinicAddress || "Clinic"}
              <br />
              {selectedVet.vetName || "Unknown Vet"} •{" "}
              {selectedVet.vetPhone || "N/A"}
            </div>
            <form onSubmit={handleBookSubmit}>
              <div className="mb-2">
                <label className="form-label">Pet</label>
                <select name="petId" className="form-control" required>
                  <option value="">Select your pet</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Reason</label>
                <input
                  name="reason"
                  className="form-control"
                  placeholder="Vaccination, Check-up, etc."
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Time</label>
                <input
                  type="time"
                  name="time"
                  className="form-control"
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedVet(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Confirm Booking
                </button>
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
