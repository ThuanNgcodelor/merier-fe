import React, { useState, useEffect } from 'react';
import { getAdoptionRequests, updateAdoptionRequest } from '../../api/shelter';

export default function AdoptionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const shelterId = 'current_shelter_id'; // Replace with actual shelter ID

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await getAdoptionRequests(shelterId);
      setRequests(res.data);
    } catch (error) {
      console.error('Error loading adoption requests:', error);
      // Mock data for testing
      setRequests([
        {
          id: 1,
          pet_name: 'Buddy',
          user_name: 'John Doe',
          user_email: 'john@example.com',
          status: 'pending',
          request_date: '2023-10-01'
        },
        {
          id: 2,
          pet_name: 'Whiskers',
          user_name: 'Jane Smith',
          user_email: 'jane@example.com',
          status: 'pending',
          request_date: '2023-10-02'
        }
      ]);
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateAdoptionRequest(id, { status: 'approved' });
      loadRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      // Update locally for mock
      setRequests(requests.map(req => req.id === id ? { ...req, status: 'approved' } : req));
    }
  };

  const handleReject = async (id) => {
    try {
      await updateAdoptionRequest(id, { status: 'rejected' });
      loadRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      // Update locally for mock
      setRequests(requests.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Adoption Requests</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.pet_name}</td>
                <td>{request.user_name}</td>
                <td>{request.user_email}</td>
                <td>{request.request_date}</td>
                <td>
                  <span className={`badge ${request.status === 'approved' ? 'bg-success' : request.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
