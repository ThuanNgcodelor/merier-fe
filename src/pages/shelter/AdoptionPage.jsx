import React, { useState, useEffect } from 'react';
import { getAdoptionListings, createAdoptionListing, updateAdoptionListing } from '../../api/shelter';
import { useForm } from 'react-hook-form';

export default function AdoptionPage() {
  const [adoptionListings, setAdoptionListings] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const shelterUserId = 'current_shelter_user_id'; // Replace with actual

  useEffect(() => {
    loadAdoptions();
  }, []);

  const loadAdoptions = async () => {
    try {
      const res = await getAdoptionListings(shelterUserId);
      setAdoptionListings(res.data);
    } catch (error) {
      console.error('Error loading adoption listings:', error);
    }
  };

  const onSubmitListing = async (data) => {
    try {
      await createAdoptionListing({ ...data, shelter_id: shelterUserId });
      loadAdoptions();
      reset();
    } catch (error) {
      console.error('Error creating adoption listing:', error);
    }
  };

  const updateListingStatus = async (id, status) => {
    try {
      await updateAdoptionListing(id, { status });
      loadAdoptions();
    } catch (error) {
      console.error('Error updating adoption listing:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Adoption Management</h1>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Create Adoption Listing</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmitListing)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Pet Name</label>
                <input {...register('pet_name')} className="form-control" placeholder="Pet Name" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Species</label>
                <input {...register('species')} className="form-control" placeholder="Species" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Breed</label>
                <input {...register('breed')} className="form-control" placeholder="Breed" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Age (Months)</label>
                <input {...register('age_months')} type="number" className="form-control" placeholder="Age in Months" />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea {...register('description')} className="form-control" placeholder="Description" rows="3" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Create Listing</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Adoption Listings</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {adoptionListings.map(listing => (
                  <tr key={listing.id}>
                    <td>{listing.pet_name}</td>
                    <td>{listing.species}</td>
                    <td>{listing.breed}</td>
                    <td>{listing.age_months} months</td>
                    <td>
                      <span className={`badge ${listing.status === 'available' ? 'bg-success' : listing.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => updateListingStatus(listing.id, 'available')}
                      >
                        Available
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => updateListingStatus(listing.id, 'pending')}
                      >
                        Pending
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateListingStatus(listing.id, 'adopted')}
                      >
                        Adopted
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
