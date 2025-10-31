import Header from "../../components/client/Header.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";
import Slider from "../../components/client/Slider.jsx";
import { getMyPets } from "../../api/user.js";
import { useState, useEffect } from "react";
import ChatBotWidget from "../../components/client/ChatBotWidget.jsx";
import Footer from "../../components/client/Footer.jsx";
import Swal from "sweetalert2";

export default function HomePage() {
  const [selectedVet, setSelectedVet] = useState(null);
  const [, setPets] = useState([]);

  useEffect(() => {
    if (selectedVet) {
      (async () => {
        try {
          const data = await getMyPets();
          setPets(Array.isArray(data) ? data : []);
        } catch {
          setPets([]);
        }
      })();
    }
  }, [selectedVet]);


  return (
    <div className="wrapper">
      <Header />
      <main className="main-content">
        {/*<Slider />*/}
        <AllProduct />
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
                {selectedVet.clinicAddress}
              </div>
                     </div>
          </div>
        )}
      </main>
      <Footer />
      <ChatBotWidget />
    </div>
  );
}
