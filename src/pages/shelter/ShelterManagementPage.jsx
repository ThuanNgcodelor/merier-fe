import React, { useState, useEffect } from 'react';
import { getShelterProfile, updateShelterProfile, getStaff, addStaff, updateStaff, deleteStaff } from '../../api/shelter';
import { useForm } from 'react-hook-form';
import Header from '../../components/client/Header';

export default function ShelterManagementPage() {
  const [shelterProfile, setShelterProfile] = useState({});
  const [staff, setStaff] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const shelterUserId = 'current_shelter_user_id'; // Replace with actual

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileRes = await getShelterProfile(shelterUserId);
      setShelterProfile(profileRes.data);

      const staffRes = await getStaff(shelterUserId);
      setStaff(staffRes.data);
    } catch (error) {
      console.error('Error loading shelter data:', error);
    }
  };

  const onSubmitProfile = async (data) => {
    try {
      await updateShelterProfile(shelterUserId, data);
      loadData();
    } catch (error) {
      console.error('Error updating shelter profile:', error);
    }
  };

  const onSubmitStaff = async (data) => {
    try {
      await addStaff({ ...data, primary_role: 'shelter_staff' });
      loadData();
      reset();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const updateStaffMember = async (id, updates) => {
    try {
      await updateStaff(id, updates);
      loadData();
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  const removeStaff = async (id) => {
    try {
      await deleteStaff(id);
      loadData();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <div className="wrapper">
     
    <div className="container">
      <h1 className="mb-4">Shelter Management</h1>
      <div className="card mb-4">
        <div className="card-header">
          <h5>Update Shelter Information</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmitProfile)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Shelter Name</label>
                <input {...register('shelter_name')} defaultValue={shelterProfile.shelter_name} className="form-control" placeholder="Shelter Name" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input {...register('address')} defaultValue={shelterProfile.address} className="form-control" placeholder="Address" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Contact Email</label>
                <input {...register('contact_email')} defaultValue={shelterProfile.contact_email} type="email" className="form-control" placeholder="Contact Email" />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Hotline</label>
                <input {...register('hotline')} defaultValue={shelterProfile.hotline} className="form-control" placeholder="Hotline" />
              </div>
              <div className="col-md-12 mb-3">
                <label className="form-label">Description</label>
                <textarea {...register('description')} defaultValue={shelterProfile.description} className="form-control" placeholder="Description" rows="3" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Manage Staff</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmitStaff)} className="mb-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input {...register('first_name')} className="form-control" placeholder="First Name" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input {...register('last_name')} className="form-control" placeholder="Last Name" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input {...register('email')} type="email" className="form-control" placeholder="Email" required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number</label>
                <input {...register('phone_number')} className="form-control" placeholder="Phone Number" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Staff</button>
          </form>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(member => (
                  <tr key={member.id}>
                    <td>{member.first_name} {member.last_name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone_number}</td>
                    <td>
                      <span className={`badge ${member.active ? 'bg-success' : 'bg-secondary'}`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => updateStaffMember(member.id, { active: !member.active })}
                      >
                        {member.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeStaff(member.id)}
                      >
                        Remove
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
</div>
  );
}
