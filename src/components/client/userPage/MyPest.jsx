import React, { useState, useEffect } from "react";
import { getMyPets, createPet, updatePet, updatePetStatus, getPetHealthRecords, deletePet } from "../../../api/user.js";

export default function MyPest() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPet, setSelectedPet] = useState(null);
    const [healthRecords, setHealthRecords] = useState([]);
    const [showHealthRecords, setShowHealthRecords] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        species: "",
        breed: "",
        birthDate: "",
        gender: "",
        color: "",
        weightKg: "",
        microchipNumber: "",
        vaccinated: false,
        sterilized: false,
        lastVetVisit: "",
        notes: "",
        status: "ACTIVE"
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            setLoading(true);
            const petsData = await getMyPets();
            setPets(petsData);
        } catch (error) {
            console.error("Error fetching pets:", error);
            setMessage('An error occurred while loading your pets. Please try again later.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (petId, newStatus) => {
        try {
            setMessage('');
            setMessageType('');
            await updatePetStatus(petId, newStatus);
            setMessage('Pet status updated successfully.');
            setMessageType('success');
            fetchPets();
        } catch (error) {
            console.error("Error updating pet status:", error);
            setMessage('Failed to update pet status.');
            setMessageType('error');
        }
    };

    const handleViewHealthRecords = async (petId) => {
        try {
            setMessage('');
            setMessageType('');
            const records = await getPetHealthRecords(petId);
            setHealthRecords(records);
            setShowHealthRecords(true);
        } catch (error) {
            console.error("Error fetching health records:", error);
            setMessage('Failed to fetch health records.');
            setMessageType('error');
        }
    };

    const handleEditPet = (pet) => {
        setEditingPet(pet);
        setEditForm({
            name: pet.name || "",
            species: pet.species || "",
            breed: pet.breed || "",
            birthDate: pet.birthDate || "",
            gender: pet.gender || "",
            color: pet.color || "",
            weightKg: pet.weightKg || "",
            microchipNumber: pet.microchipNumber || "",
            vaccinated: pet.vaccinated || false,
            sterilized: pet.sterilized || false,
            lastVetVisit: pet.lastVetVisit || "",
            notes: pet.notes || "",
            status: pet.status || "ACTIVE"
        });
        setSelectedFile(null);
    };

    const handleAddPet = () => {
        setShowAddForm(true);
        setEditForm({
            name: "",
            species: "",
            breed: "",
            birthDate: "",
            gender: "",
            color: "",
            weightKg: "",
            microchipNumber: "",
            vaccinated: false,
            sterilized: false,
            lastVetVisit: "",
            notes: "",
            status: "ACTIVE"
        });
        setSelectedFile(null);
    };

    const validatePetForm = (data) => {
        const e = {};
        const isEmpty = (v) => !v || String(v).trim() === "";

        if (isEmpty(data.name)) e.name = "Name is required";
        if (isEmpty(data.species)) e.species = "Species is required";
        if (isEmpty(data.gender)) e.gender = "Gender is required";
        if (!isEmpty(data.weightKg)) {
            const w = Number(data.weightKg);
            if (Number.isNaN(w) || w <= 0) e.weightKg = "Weight must be a number > 0";
        }
        // birthDate optional but must be valid and not in the future
        if (!isEmpty(data.birthDate)) {
            const d = new Date(data.birthDate);
            if (isNaN(d.getTime())) e.birthDate = "Invalid birth date";
            else {
                const today = new Date();
                if (d > today) e.birthDate = "Birth date cannot be in the future";
            }
        }
        // lastVetVisit optional and not in the future
        if (!isEmpty(data.lastVetVisit)) {
            const d2 = new Date(data.lastVetVisit);
            if (isNaN(d2.getTime())) e.lastVetVisit = "Invalid visit date";
            else {
                const today = new Date();
                if (d2 > today) e.lastVetVisit = "Last vet visit cannot be in the future";
            }
        }

        return e;
    };

    const handleSaveEdit = async () => {
        try {
            // Validate before submit
            const v = validatePetForm(editForm);
            setErrors(v);
            if (Object.keys(v).length > 0) {
                setMessage('Please check the input fields.');
                setMessageType('error');
                return;
            }

            if (editingPet) {
                await updatePet(editingPet.id, editForm, selectedFile);
                setMessage('Pet updated successfully.');
                setMessageType('success');
                setEditingPet(null);
            } else {
                await createPet(editForm, selectedFile);
                setMessage('Pet added successfully.');
                setMessageType('success');
                setShowAddForm(false);
            }
            fetchPets();
        } catch (error) {
            console.error("Error saving pet:", error);
            setMessage('Failed to save pet.');
            setMessageType('error');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };


    const handleDeletePet = async (petId) => {
        if (!window.confirm("Are you sure you want to delete this pet?")) return;
        try {
            setMessage('');
            setMessageType('');
            await deletePet(petId, true);
            setMessage('Pet deleted successfully.');
            setMessageType('success');
            fetchPets();
        } catch (error) {
            console.error("Error deleting pet:", error);
            setMessage('Failed to delete pet.');
            setMessageType('error');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            ACTIVE: "badge-success",
            INACTIVE: "badge-secondary",
            DECEASED: "badge-danger"
        };
        return `badge ${statusClasses[status] || "badge-secondary"}`;
    };

    const renderPetForm = (title, isEdit = false) => (
  <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header border-0 pb-0">
          <div>
            <h5 className="modal-title mb-1">{title}</h5>
            <small className="text-muted">Fill in the information below. Fields marked with <span className="text-danger">*</span> are required.</small>
          </div>
        </div>

        <div className="modal-body pt-0">
          {/* BASIC INFO */}
          <div className="mb-3 pb-2 border-bottom">
            <h6 className="mb-2">Basic Info</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    placeholder="e.g., Milo"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Species <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.species ? "is-invalid" : ""}`}
                    placeholder="Dog, Cat..."
                    value={editForm.species}
                    onChange={(e) => setEditForm({ ...editForm, species: e.target.value })}
                  />
                  {errors.species && <div className="invalid-feedback">{errors.species}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Breed</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Shiba Inu..."
                    value={editForm.breed}
                    onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Gender <span className="text-danger">*</span></label>
                  <select
                    className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                    value={editForm.gender}
                    onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* PHYSICAL INFO */}
          <div className="mb-3 pb-2 border-bottom">
            <h6 className="mb-2">Physical Info</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Red, Black..."
                    value={editForm.color}
                    onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Weight (kg) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.weightKg ? "is-invalid" : ""}`}
                    placeholder="e.g., 9.8"
                    value={editForm.weightKg}
                    onChange={(e) => setEditForm({ ...editForm, weightKg: e.target.value })}
                  />
                  {errors.weightKg && <div className="invalid-feedback">{errors.weightKg}</div>}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Birth Date</label>
                  <input
                    type="date"
                    className={`form-control ${errors.birthDate ? "is-invalid" : ""}`}
                    value={editForm.birthDate}
                    onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
                  />
                  {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Microchip Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MC-123456..."
                    value={editForm.microchipNumber}
                    onChange={(e) => setEditForm({ ...editForm, microchipNumber: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* HEALTH & STATUS */}
          <div className="mb-3 pb-2 border-bottom">
            <h6 className="mb-2">Health & Status</h6>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Last Vet Visit</label>
                  <input
                    type="date"
                    className={`form-control ${errors.lastVetVisit ? "is-invalid" : ""}`}
                    value={editForm.lastVetVisit}
                    onChange={(e) => setEditForm({ ...editForm, lastVetVisit: e.target.value })}
                  />
                  {errors.lastVetVisit && <div className="invalid-feedback">{errors.lastVetVisit}</div>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="mb-1">Status</label>
                  <select
                    className="form-control"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DECEASED">Deceased</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex gap-4">
              <div className="form-check mr-4">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="vaccinated"
                  checked={editForm.vaccinated}
                  onChange={(e) => setEditForm({ ...editForm, vaccinated: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="vaccinated">Vaccinated</label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="sterilized"
                  checked={editForm.sterilized}
                  onChange={(e) => setEditForm({ ...editForm, sterilized: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="sterilized">Sterilized</label>
              </div>
            </div>
          </div>

          {/* MEDIA & NOTES */}
          <div>
            <h6 className="mb-2">Media & Notes</h6>
            <div className="form-group mb-3">
              <label className="mb-1">Pet Image</label>
              <input
                type="file"
                className="form-control-file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small className="text-muted">Supports .jpg, .png images (max ~5MB).</small>
            </div>
            <div className="form-group">
              <label className="mb-1">Notes</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Additional notes about your pet..."
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              if (isEdit) setEditingPet(null);
              else setShowAddForm(false);
              setErrors({});
              setSelectedFile(null);
            }}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveEdit}
            disabled={submitting}
          >
            {submitting ? "Saving..." : isEdit ? "Update Pet" : "Add Pet"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

    if (loading) {
        return (
            <div className="tab-pane fade show active">
                <div className="myaccount-content">
                    <h3>My Pets</h3>
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="tab-pane fade show active">
            <div className="myaccount-content">
                 <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3>My Pets</h3>
                    <button
                        className="btn btn-primary"
                        onClick={handleAddPet}
                    >
                    <i className="fas fa-plus"></i>Add New Pet
                    </button>
                </div>

                {message && (
                    <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {message}
                    </div>
                )}
                
                <div className="myaccount-table table-responsive text-center">
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Species</th>
                                <th>Gender</th>
                                <th>Weight (kg)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No pets found. Add your first pet!
                                    </td>
                                </tr>
                            ) : (
                                pets.map((pet) => (
                                    <tr key={pet.id}>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeletePet(pet.id)}
                                                title="Delete Pet"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                        <td>{pet.name}</td>
                                        <td>{pet.species}</td>
                                        <td>{pet.gender}</td>
                                        <td>{pet.weightKg}</td>
                                        <td>
                                            <span className={getStatusBadge(pet.status)}>
                                                {pet.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => handleViewHealthRecords(pet.id)}
                                                    title="View Health Records"
                                                >
                                                    <i className="fas fa-heartbeat"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => handleEditPet(pet)}
                                                    title="Edit Pet"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <select
                                                    className="btn btn-sm btn-secondary"
                                                    value={pet.status}
                                                    onChange={(e) => handleStatusChange(pet.id, e.target.value)}
                                                    title="Change Status"
                                                >
                                                    <option value="ACTIVE">Active</option>
                                                    <option value="INACTIVE">Inactive</option>
                                                    <option value="DECEASED">Deceased</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Health Records Modal */}
                {showHealthRecords && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Health Records</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setShowHealthRecords(false)}
                                    >
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {healthRecords.length === 0 ? (
                                        <p>No health records found.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Event Type</th>
                                                        <th>Date</th>
                                                        <th>Vet Name</th>
                                                        <th>Clinic</th>
                                                        <th>Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {healthRecords.map((record, index) => (
                                                        <tr key={index}>
                                                            <td>{record.eventType}</td>
                                                            <td>{formatDate(record.eventDate)}</td>
                                                            <td>{record.vetName}</td>
                                                            <td>{record.clinic}</td>
                                                            <td>{record.description}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowHealthRecords(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Pet Modal */}
                {showAddForm && renderPetForm("Add New Pet", false)}

                {/* Edit Pet Modal */}
                {editingPet && renderPetForm(`Edit Pet: ${editingPet.name}`, true)}
            </div>
        </div>
    );
}