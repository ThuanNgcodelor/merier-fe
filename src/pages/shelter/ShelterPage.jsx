import React, { useState, useEffect } from "react";
import {createOrGetShelterProfile, getStaff, listMyPets} from "../../api/shelter";

export default function ShelterPage() {
  const [shelterProfile, setShelterProfile] = useState({});
  const [pets, setPets] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await createOrGetShelterProfile();
        setShelterProfile(profile || {});
      } catch (e) {
        console.error("Load profile failed:", e);
        setShelterProfile({});
      }
      try {
        const myPets = await listMyPets();
        setPets(myPets || []);
      } catch (e) {
        console.error("Load pets failed:", e);
        setPets([]);
      }
      try {
        const st = await getStaff(); 
        setStaff(Array.isArray(st) ? st : []);
      } catch (e) {
        console.warn("Load staff failed (optional):", e);
        setStaff([]);
      }
    };
    load();
  }, []);

  const availablePets = pets.filter((p) => p.adoptionStatus === "AVAILABLE");
  const activeListings = availablePets;
  const activeStaff = staff.filter((m) => m.active);

  return (
    <div className="container">
      <h1 className="mb-4">Welcome to {shelterProfile.shelterName || "Shelter"} Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{pets.length}</h5>
              <p className="card-text">Total Pets</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{availablePets.length}</h5>
              <p className="card-text">Available Pets</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{activeListings.length}</h5>
              <p className="card-text">Active Listings</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">{activeStaff.length}</h5>
              <p className="card-text">Active Staff</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Shelter info */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><h5>Shelter Information</h5></div>
            <div className="card-body">
              <p><strong>Address:</strong> {shelterProfile.address || "-"}</p>
<p><strong>Contact Email:</strong> {shelterProfile.contactEmail || "-"}</p>
              <p><strong>Hotline:</strong> {shelterProfile.hotline || "-"}</p>
              <p><strong>Description:</strong> {shelterProfile.description || "-"}</p>
            </div>
          </div>
        </div>

        {/* Recent pets */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><h5>Recent Pets</h5></div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {pets.slice(0, 5).map((pet) => (
                  <li key={pet.id} className="list-group-item">
                    {pet.name} ({pet.species}) -{" "}
                    <span className={`badge ${
                      pet.adoptionStatus === "AVAILABLE" ? "bg-success" :
                      pet.adoptionStatus === "PENDING_REVIEW" ? "bg-warning text-dark" : "bg-secondary"
                    }`}>
                      {pet.adoptionStatus?.toLowerCase()}
                    </span>
                  </li>
                ))}
                {pets.length === 0 && <li className="list-group-item">No pets</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Active listings & staff */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><h5>Active Adoption Listings</h5></div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {activeListings.slice(0, 5).map((p) => (
                  <li key={p.id} className="list-group-item">
                    {p.name} ({p.species}) {p.breed ? `– ${p.breed}` : ""}
                  </li>
                ))}
                {activeListings.length === 0 && <li className="list-group-item">No active listings</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header"><h5>Staff Members</h5></div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {activeStaff.slice(0, 5).map((m) => (
                  <li key={m.id} className="list-group-item">
                    {m.first_name} {m.last_name} – {m.email}
                  </li>
                ))}
                {activeStaff.length === 0 && <li className="list-group-item">No active staff</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}