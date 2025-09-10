import React, { useEffect, useState } from "react";
import { getVetProfile, updateVetProfile } from "../../api/vetMock.js";

export default function VetProfile() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    getVetProfile().then(data => setForm(data));
  }, []);

  if (!form) return <p>Loading profile...</p>;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave() {
    updateVetProfile(form).then(() => alert("Profile updated successfully ✅"));
  }

  return (
    <div className="container py-4">
      <h2>Vet Profile</h2>
      <div className="mb-3">
        <label>Specialization</label>
        <input
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Clinic Address</label>
        <input
          name="clinic_address"
          value={form.clinic_address}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Years of Experience</label>
        <input
          type="number"
          name="years_experience"
          value={form.years_experience}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Biography</label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          className="form-control"
        />
      </div>
      <button className="btn btn-success" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}
