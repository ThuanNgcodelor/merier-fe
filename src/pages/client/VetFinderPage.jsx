import React, { useState } from "react";

const vets = [
  {
    id: "v1",
    name: "Dr. John Smith",
    specialization: "Dogs & Cats",
    clinic: "Happy Paws Clinic",
    address: "123 Le Loi, District 1, HCMC",
    price: 650,
    yearsExperience: 8,
    image: "https://via.placeholder.com/200x150?text=Vet+1",
  },
  {
    id: "v2",
    name: "Dr. Anna Nguyen",
    specialization: "General Surgery",
    clinic: "VetCare Center",
    address: "45 Nguyen Trai, District 5, HCMC",
    price: 550,
    yearsExperience: 5,
    image: "https://via.placeholder.com/200x150?text=Vet+2",
  },
  {
    id: "v3",
    name: "Dr. Minh Tran",
    specialization: "Dermatology",
    clinic: "Skin & Coat Pet Clinic",
    address: "22 Vo Van Tan, District 3, HCMC",
    price: 600,
    yearsExperience: 7,
    image: "https://via.placeholder.com/200x150?text=Vet+3",
  },
];

// Card
function VetCard({ vet, onBook }) {
  return (
    <div className="card shadow-sm p-3 m-2" style={{ borderRadius: "16px" }}>
      <div className="text-center">
        <img src={vet.image} alt={vet.name} className="img-fluid mb-2" />
      </div>
      <h5 className="fw-bold">{vet.name}</h5>
      <p className="text-muted mb-1">{vet.specialization}</p>
      <p className="small mb-1">{vet.clinic}</p>
      <p className="small">{vet.address}</p>
      <p>
        <strong>${vet.price}</strong> — {vet.yearsExperience} yrs exp.
      </p>
      <button className="btn btn-primary btn-sm" onClick={() => onBook(vet)}>
        Book Appointment
      </button>
    </div>
  );
}

// Modal
function BookingModal({ vet, onClose }) {
  if (!vet) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    alert(
      `Booked ${vet.name} for ${form.get("petName")} on ${form.get("date")} at ${form.get("time")}`
    );
    onClose();
  };

  return (
    <div className="vf-backdrop">
      <div className="vf-modal p-4 bg-white rounded shadow">
        <h4 className="mb-3">Book Appointment with {vet.name}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Pet Name</label>
            <input name="petName" className="form-control" required />
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

// Page
export default function VetFinderPage() {
  const [selectedVet, setSelectedVet] = useState(null);

  return (
    <div className="container my-4">
      <h3 className="mb-3">Find a Vet & Book</h3>
      <div className="row">
        {vets.map((vet) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={vet.id}>
            <VetCard vet={vet} onBook={setSelectedVet} />
          </div>
        ))}
      </div>

      {selectedVet && (
        <BookingModal vet={selectedVet} onClose={() => setSelectedVet(null)} />
      )}
    </div>
  );
}

// Inline styles (optional – hoặc bỏ vào CSS global của bạn)
const style = document.createElement("style");
style.innerHTML = `
.vf-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1000}
.vf-modal{max-width:420px;width:100%}
`;
document.head.appendChild(style);
