import { useEffect, useState } from "react";
import { createAddress, getAllAddress, getUser, deleteAddress, getAddressId, updateAddress , setDefaultAddress } from "../../../api/user.js";

export default function Address() {
    const [, setUserData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [addresses, setAddress] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addressName: '',
        recipientName: '',
        recipientPhone: '',
        province: '',
        streetAddress: '',
        isDefault: false
    });
    const [editAddress, setEditAddress] = useState({
        id: '',
        addressName: '',
        recipientName: '',
        recipientPhone: '',
        province: '',
        streetAddress: ''
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        getUser().then((data) => setUserData(data));
        fetchAddresses();
    }, []);

    const handleEditClick = async (address) => {
        try {
            setLoading(true);
            const addressData = await getAddressId(address.addressId);
            setEditAddress({
                id: addressData.addressId,
                addressName: addressData.addressName || '',
                recipientName: addressData.recipientName || '',
                recipientPhone: addressData.recipientPhone || '',
                province: addressData.province || '',
                streetAddress: addressData.streetAddress || ''
            });
            setShowEditModal(true);
        } catch {
            setError('Failed to load address data');
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (address) => {
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await setDefaultAddress(address.addressId);
            setSuccess('Default address set successfully!');
            await fetchAddresses();
        } catch {
            setError('Failed to set default address. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await updateAddress(editAddress);
            setSuccess('Address updated successfully!');
            setShowEditModal(false);
            await fetchAddresses();
        } catch {
            setError('Failed to update address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeleteClick = (address) => {
        setAddressToDelete(address);
        setShowDeleteConfirm(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setAddressToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!addressToDelete) return;

        try {
            await deleteAddress(addressToDelete.addressId);
            setSuccess('Address deleted successfully!');
            await fetchAddresses();
        } catch  {
            setError('Failed to delete address. Please try again.');
        } finally {
            setShowDeleteConfirm(false);
            setAddressToDelete(null);
        }
    };

    const fetchAddresses = async () => {
        try {
            const data = await getAllAddress();
            setAddress(data);
        } catch{
            setError('Failed to fetch addresses');
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await createAddress(newAddress);
            setSuccess('Address added successfully!');
            setShowModal(false);

            setNewAddress({
                addressName: '',
                recipientName: '',
                recipientPhone: '',
                province: '',
                streetAddress: '',
                isDefault: false
            });
            await fetchAddresses();
        } catch {
            setError('Failed to add address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-pane fade show active">
            <div className="myaccount-content">
                <div className="row mt-4">
                    <div className="single-input-item">
                        <button
                            className="check-btn sqr-btn"
                            onClick={() => setShowModal(true)}
                        >
                            <i className="fa fa-plus"></i> Add New Address
                        </button>
                    </div>
                </div>
                <br />

                {success && (
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <div key={index} className="row mb-4">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="row align-items-center">
                                            <div className="col-12 col-md-6 mb-2 mb-md-0">
                                                <h3 className="mb-0">
                                                    {address.addressName || `Address ${index + 1}`}
                                                    {address.isDefault && (
                                                        <span className="badge border border-success text-success ms-2">Default</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-md-end">
                                                    <button className="btn"
                                                        onClick={() => handleSetDefault(address)}
                                                    >
                                                        Set Default
                                                    </button>
                                                    <button
                                                        className="btn  "
                                                        onClick={() => handleEditClick(address)}
                                                    >
                                                        <i className="fa fa-edit"></i> Edit
                                                    </button>
                                                    <button
                                                        className="btn  "
                                                        onClick={() => handleDeleteClick(address)}
                                                    >
                                                        <i className="fa fa-trash"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <address className="mb-0">
                                            <p><strong>Recipient Name</strong>: {address.recipientName}</p>
                                            <p><strong>Recipient Phone</strong>: {address.recipientPhone}</p>
                                            <p><strong>Street Address</strong>: {address.streetAddress}</p>
                                            <p><strong>Province</strong>: {address.province}</p>
                                            <p><strong>Default</strong>: {address.isDefault ? 'Yes' : 'No'}</p>
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="alert alert-info" role="alert">
                                No addresses found. Please add your first address.
                            </div>
                        </div>
                    </div>
                )}




                {/* Modal for New Address */}
                {showModal && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg-12">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Address</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <br />
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Address Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="addressName"
                                                    value={newAddress.addressName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="recipientPhone"
                                                    value={newAddress.recipientPhone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Recipient Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="recipientName"
                                                value={newAddress.recipientName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Province *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="province"
                                                value={newAddress.province}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Street Address *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="streetAddress"
                                                value={newAddress.streetAddress}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-secondary">
                                            Save Address
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {showDeleteConfirm && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCancelDelete}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this address?</p>
                                    <p><strong>Address:</strong> {addressToDelete?.addressName || 'Unnamed Address'}</p>
                                    <p><strong>Recipient:</strong> {addressToDelete?.recipientName}</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancelDelete}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={handleConfirmDelete}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg-12">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Address</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowEditModal(false)}
                                    ></button>
                                </div>
                                <br />
                                <form onSubmit={handleEditSubmit}>
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Address Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="addressName"
                                                    value={editAddress.addressName}
                                                    onChange={handleEditInputChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="recipientPhone"
                                                    value={editAddress.recipientPhone}
                                                    onChange={handleEditInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Recipient Name *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="recipientName"
                                                value={editAddress.recipientName}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Province *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="province"
                                                value={editAddress.province}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Street Address *</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="streetAddress"
                                                value={editAddress.streetAddress}
                                                onChange={handleEditInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowEditModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating...' : 'Update Address'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}