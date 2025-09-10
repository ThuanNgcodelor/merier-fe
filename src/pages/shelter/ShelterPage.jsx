import React, { useState, useEffect } from 'react';

export default function ShelterPage() {
  const [shelterProfile, setShelterProfile] = useState({});
  const [pets, setPets] = useState([]);
  const [adoptionListings, setAdoptionListings] = useState([]);
  const [staff, setStaff] = useState([]);

  const shelterUserId = 'current_shelter_user_id'; // Replace with actual user id from auth

  // Mock data for testing
  const mockShelterProfile = {
    shelter_name: 'Shelter ABC',
    address: '123 Main St',
    contact_email: 'contact@shelterabc.com',
    hotline: '0123456789',
    description: 'A friendly shelter for pets.'
  };

  const mockPets = [
    { id: 1, name: 'Buddy', species: 'Dog', status: 'available' },
    { id: 2, name: 'Whiskers', species: 'Cat', status: 'adopted' },
    { id: 3, name: 'Max', species: 'Dog', status: 'available' },
  ];

  const mockAdoptionListings = [
    { id: 1, pet_name: 'Buddy', species: 'Dog', age_months: 24, status: 'available' },
    { id: 2, pet_name: 'Whiskers', species: 'Cat', age_months: 36, status: 'pending' },
  ];

  const mockStaff = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', active: true },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', active: false },
  ];

  useEffect(() => {
    // Use mock data for testing
    setShelterProfile(mockShelterProfile);
    setPets(mockPets);
    setAdoptionListings(mockAdoptionListings);
    setStaff(mockStaff);
  }, []);

  const availablePets = pets.filter(pet => pet.status === 'available');
  const adoptedPets = pets.filter(pet => pet.status === 'adopted');
  const activeListings = adoptionListings.filter(listing => listing.status === 'available');
  const activeStaff = staff.filter(member => member.active);

  return (
    <div className="container">
      <h1 className="mb-4">Welcome to {shelterProfile.shelter_name || 'Shelter'} Dashboard</h1>

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
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Shelter Information</h5>
            </div>
            <div className="card-body">
              <p><strong>Address:</strong> {shelterProfile.address}</p>
              <p><strong>Contact Email:</strong> {shelterProfile.contact_email}</p>
              <p><strong>Hotline:</strong> {shelterProfile.hotline}</p>
              <p><strong>Description:</strong> {shelterProfile.description}</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Pets</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {pets.slice(0, 5).map(pet => (
                  <li key={pet.id} className="list-group-item">
                    {pet.name} ({pet.species}) - <span className={`badge ${pet.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>{pet.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Active Adoption Listings</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {activeListings.slice(0, 5).map(listing => (
                  <li key={listing.id} className="list-group-item">
                    {listing.pet_name} ({listing.species}) - {listing.age_months} months
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5>Staff Members</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {activeStaff.slice(0, 5).map(member => (
                  <li key={member.id} className="list-group-item">
                    {member.first_name} {member.last_name} - {member.email}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
