import Header from "../../components/client/Header.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";
import Slider from "../../components/client/Slider.jsx";
import AllVets from "../../components/client/vet/AllVets.jsx";
import {getMyPets} from "../../api/user.js";
import {createAppointment} from "../../api/appointments.js";
import {useState, useEffect} from "react";
import ChatBotWidget from "../../components/client/ChatBotWidget.jsx";

export default function HomePage() {
  const [selectedVet, setSelectedVet] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (selectedVet) {
      (async () => {
        try {
          const data = await getMyPets();
          setPets(Array.isArray(data) ? data : []);
        } catch (e) {
          setPets([]);
        }
      })();
    }
  }, [selectedVet]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
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
        vetId: selectedVet.userId, // Backend uses userId as the primary ID for vets
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        reason: reason || "Vet appointment"
      };

      console.log("Sending booking data:", bookingData);

      // Call API to create appointment
      await createAppointment(bookingData);

      alert(`Successfully booked ${selectedVet.specialization || 'Veterinarian'} for ${petName} on ${date} at ${time} (Reason: ${reason})`);
      setSelectedVet(null);
    } catch (error) {
      console.error("Error creating appointment:", error);
      const errorMessage = error?.response?.data?.message || "Failed to book appointment. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                 <Slider/>
                 <AllProduct/>
                 <AllVets/>
        {/* <section className="container my-5">
        </section> */}
        {/* ===== BOOKING MODAL ===== */}
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

        {/* ===== FLOATING AI CHATBOT ===== */}


        <ChatBotWidget />
            </main>
        </div>
    );
}




