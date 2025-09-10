import React, { useState, useEffect } from 'react';
// import { getPets, addPet, updatePet } from '../../api/shelter';
import { useForm } from 'react-hook-form';

export default function PetManagementPage() {
  const [pets, setPets] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const shelterUserId = 'current_shelter_user_id'; // Replace with actual

  // Mock data for testing
  const mockPets = [
    {
      id: 1,
      name: 'Buddy',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'male',
      status: 'available'
    },
    {
      id: 2,
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      gender: 'female',
      status: 'available'
    },
    {
      id: 3,
      name: 'Max',
      species: 'Dog',
      breed: 'Labrador',
      gender: 'male',
      status: 'adopted'
    }
  ];

  useEffect(() => {
    // loadPets();
    setPets(mockPets);
  }, []);

  // const loadPets = async () => {
  //   try {
  //     const res = await getPets(shelterUserId);
  //     setPets(res.data);
  //   } catch (error) {
  //     console.error('Error loading pets:', error);
  //   }
  // };

  const onSubmitPet = (data) => {
    // try {
    //   await addPet({ ...data, owner_id: shelterUserId });
    //   loadPets();
    //   reset();
    // } catch (error) {
    //   console.error('Error adding pet:', error);
    // }
    const newPet = {
      id: pets.length + 1,
      ...data,
      status: 'available'
    };
    setPets(prev => [...prev, newPet]);
    reset();
  };

  const updatePetStatus = (id, status) => {
    // try {
    //   await updatePet(id, { status });
    //   loadPets();
    // } catch (error) {
    //   console.error('Error updating pet:', error);
    // }
    setPets(prev => prev.map(pet => pet.id === id ? { ...pet, status } : pet));
  };

  return (
    <div className="container">
      <h1 className="mb-4">Pet Management</h1>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Add New Pet</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmitPet)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Pet Name</label>
                <input {...register('name')} className="form-control" placeholder="Pet Name" required />
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
                <label className="form-label">Gender</label>
                <select {...register('gender')} className="form-select">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Birth Date</label>
                <input {...register('birth_date')} type="date" className="form-control" />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Notes</label>
                <textarea {...register('notes')} className="form-control" placeholder="Notes" rows="3" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Pet</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Pet List</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Species</th>
                  <th>Breed</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pets.map(pet => (
                  <tr key={pet.id}>
                    <td>{pet.name}</td>
                    <td>{pet.species}</td>
                    <td>{pet.breed}</td>
                    <td>{pet.gender}</td>
                    <td>
                      <span className={`badge ${pet.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => updatePetStatus(pet.id, 'available')}
                      >
                        Available
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => updatePetStatus(pet.id, 'adopted')}
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
