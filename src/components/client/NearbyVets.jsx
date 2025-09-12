import React, { useState } from "react";

export default function NearbyVets() {
  const vets = [
    { id: "v1", name: "Dr. John Smith", specialization: "Dogs & Cats", clinic: "Happy Paws Clinic", address: "123 Le Loi, District 1, HCMC", price: 650, yearsExperience: 8, image: "https://via.placeholder.com/300x200?text=Vet+1" },
    { id: "v2", name: "Dr. Anna Nguyen", specialization: "General Surgery", clinic: "VetCare Center", address: "45 Nguyen Trai, District 5, HCMC", price: 550, yearsExperience: 5, image: "https://via.placeholder.com/300x200?text=Vet+2" },
    { id: "v3", name: "Dr. Minh Tran", specialization: "Dermatology", clinic: "Skin & Coat Pet Clinic", address: "22 Vo Van Tan, District 3, HCMC", price: 600, yearsExperience: 7, image: "https://via.placeholder.com/300x200?text=Vet+3" },
    { id: "v4", name: "Dr. Alice Pham", specialization: "Exotics (Rabbits, Birds)", clinic: "Exotic Friends Hospital", address: "81 Dien Bien Phu, Binh Thanh, HCMC", price: 700, yearsExperience: 9, image: "https://via.placeholder.com/300x200?text=Vet+4" },
    { id: "v5", name: "Dr. Kevin Lee", specialization: "Cardiology", clinic: "Pet Heart Center", address: "12 Tran Hung Dao, District 1, HCMC", price: 720, yearsExperience: 10, image: "https://via.placeholder.com/300x200?text=Vet+5" },
    { id: "v6", name: "Dr. Sophia Tran", specialization: "Dentistry", clinic: "Smile Pets Clinic", address: "34 Hai Ba Trung, District 3, HCMC", price: 480, yearsExperience: 4, image: "https://via.placeholder.com/300x200?text=Vet+6" },
    { id: "v7", name: "Dr. David Nguyen", specialization: "Neurology", clinic: "Brain & Spine Pet Hospital", address: "77 Pasteur, District 1, HCMC", price: 900, yearsExperience: 12, image: "https://via.placeholder.com/300x200?text=Vet+7" },
    { id: "v8", name: "Dr. Emily Phan", specialization: "Nutrition", clinic: "Healthy Pets Clinic", address: "21 Hoang Sa, District 1, HCMC", price: 500, yearsExperience: 6, image: "https://via.placeholder.com/300x200?text=Vet+8" },
    { id: "v9", name: "Dr. Peter Ho", specialization: "Surgery", clinic: "Advanced Pet Surgery Center", address: "65 Le Thanh Ton, District 1, HCMC", price: 950, yearsExperience: 15, image: "https://via.placeholder.com/300x200?text=Vet+9" },
    { id: "v10", name: "Dr. Lily Dang", specialization: "Oncology", clinic: "Pet Cancer Care", address: "14 Nguyen Dinh Chieu, District 3, HCMC", price: 1000, yearsExperience: 14, image: "https://via.placeholder.com/300x200?text=Vet+10" }
  ];

  const [selectedVet, setSelectedVet] = useState(null);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    alert(`Booked ${selectedVet.name} for ${form.get("petName")} on ${form.get("date")} at ${form.get("time")} (Reason: ${form.get("reason")})`);
    setSelectedVet(null);
  };

  return (
    <>
      <section className="container my-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="m-0">Nearby Vets</h3>
        </div>
        <div className="row">
          {vets.map((vet) => (
            <div key={vet.id} className="col-12 col-sm-6 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm" style={{ borderRadius: 16 }}>
                <img
                  src={vet.image}
                  alt={vet.name}
                  className="card-img-top"
                  style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, objectFit: "cover", height: 160 }}
                />
                <div className="card-body d-flex flex-column">
                  <h6 className="fw-bold mb-1">{vet.name}</h6>
                  <div className="text-muted small mb-1">{vet.specialization}</div>
                  <div className="small">{vet.clinic}</div>
                  <div className="small text-muted">{vet.address}</div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fw-semibold">${vet.price}</span>
                    <span className="badge text-bg-light">{vet.yearsExperience} yrs exp.</span>
                  </div>
                  <button className="btn btn-primary btn-sm mt-3" onClick={() => setSelectedVet(vet)}>
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {selectedVet && (
        <div className="vf-backdrop">
          <div className="vf-modal p-4 bg-white rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Book Appointment</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedVet(null)}>✕</button>
            </div>
            <div className="mb-2 text-muted small">
              {selectedVet.name} — {selectedVet.clinic}
              <br />
              {selectedVet.address}
            </div>
            <form onSubmit={handleBookSubmit}>
              <div className="mb-2">
                <label className="form-label">Pet name</label>
                <input name="petName" className="form-control" placeholder="Milo" required />
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

      <style>{`
        .vf-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 16px; }
        .vf-modal { max-width: 460px; width: 100%; }
      `}</style>
    </>
  );
}
