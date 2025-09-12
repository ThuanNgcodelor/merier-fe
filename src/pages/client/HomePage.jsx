import Header from "../../components/client/Header.jsx";
import AllProduct from "../../components/client/product/AllProduct.jsx";
import Slider from "../../components/client/Slider.jsx";
import AllVets from "../../components/client/vet/AllVets.jsx";
import {useState} from "react";

export default function HomePage() {
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
    { id: "v10", name: "Dr. Lily Dang", specialization: "Oncology", clinic: "Pet Cancer Care", address: "14 Nguyen Dinh Chieu, District 3, HCMC", price: 1000, yearsExperience: 14, image: "https://via.placeholder.com/300x200?text=Vet+10" },
  ];

  const [selectedVet, setSelectedVet] = useState(null);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    alert(`Booked ${selectedVet.name} for ${form.get("petName")} on ${form.get("date")} at ${form.get("time")} (Reason: ${form.get("reason")})`);
    setSelectedVet(null);
  };
    return (
        <div className="wrapper">
            <Header/>
            <main className="main-content">
                 <Slider/>
                 <AllProduct/>
                 <AllVets/>
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

        {/* ===== BOOKING MODAL ===== */}
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

        {/* ===== FLOATING AI CHATBOT ===== */}
        <ChatBotWidget />
            </main>
        </div>
    );
}
function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I’m PetCare Assistant 🐾. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const fakeAiReply = (userText) => {
    // Simple rule-based demo; replace with real API later.
    const t = userText.toLowerCase();
    if (t.includes("book") || t.includes("appointment") || t.includes("đặt lịch"))
      return "You can book a vet in the 'Nearby Vets' section. Pick a doctor and press **Book**.";
    if (t.includes("price") || t.includes("giá"))
      return "Prices are shown on each product card. Add to cart to see totals.";
    if (t.includes("vet") || t.includes("bác sĩ"))
      return "We have vets for general care, surgery, dermatology, dentistry and more.";
    if (t.includes("order") || t.includes("đơn"))
      return "You can review your cart and proceed to checkout from the top menu.";
    return "Got it! I’ll pass your message along. Do you need help booking a vet or finding a product?";
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const reply = fakeAiReply(userMsg.text);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setLoading(false);
    }, 500);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          className="pc-chat-fab"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          title="Chat with PetCare Assistant"
        >
          💬
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="pc-chat-panel shadow-lg">
          <div className="pc-chat-header">
            <div className="d-flex align-items-center gap-2">
              <span style={{ fontWeight: 700 }}>PetCare Assistant</span>
              <span className="badge bg-success">AI</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="pc-chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`pc-msg ${m.role === "bot" ? "pc-bot" : "pc-user"}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="pc-typing">Assistant is typing…</div>}
          </div>

          <form className="pc-chat-input" onSubmit={sendMessage}>
            <input
              type="text"
              className="form-control"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary ms-2" type="submit" disabled={loading}>Send</button>
          </form>
        </div>
      )}

      {/* Styles for chat */}
      <style>{`
        .pc-chat-fab {
          position: fixed; right: 20px; bottom: 20px; z-index: 1100;
          width: 56px; height: 56px; border-radius: 50%;
          border: none; background: #E67E22; color: #fff; font-size: 22px;
          box-shadow: 0 8px 22px rgba(0,0,0,.2);
        }
        .pc-chat-panel {
          position: fixed; right: 20px; bottom: 20px; z-index: 1100;
          width: 340px; max-height: 70vh; background: #fff; border-radius: 16px;
          display: flex; flex-direction: column; overflow: hidden;
          border: 1px solid rgba(0,0,0,.08);
        }
        .pc-chat-header {
          padding: 10px 12px; background: #f7f7f9; display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(0,0,0,.06);
        }
        .pc-chat-body {
          padding: 12px; overflow-y: auto; flex: 1; background: #fafafa;
        }
        .pc-msg { max-width: 85%; padding: 8px 12px; margin: 6px 0; border-radius: 14px; line-height: 1.35; }
        .pc-bot { background: #ffffff; border: 1px solid #eee; align-self: flex-start; }
        .pc-user { background: #E67E22; color: #fff; align-self: flex-end; margin-left: auto; }
        .pc-typing { font-size: 12px; color: #666; margin-top: 6px; }
        .pc-chat-input { padding: 10px; display: flex; border-top: 1px solid rgba(0,0,0,.06); background: #fff; }
      `}</style>
    </>
  );
}
