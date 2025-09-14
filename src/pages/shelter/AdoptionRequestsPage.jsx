// src/pages/shelter/AdoptionRequestsPage.jsx
import React, { useState, useEffect } from "react";
import {
  listMyPets,
  reviewAdoptionRequest,
  // addPet,
  updateAdoptionStatus,
} from "../../api/pet";

export default function AdoptionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [adoptionListings, setAdoptionListings] = useState([]);

  // Modal state
  const [viewing, setViewing] = useState(null); // pet object đang xem


  // badge class theo status
  const badgeOf = (s) => {
    const u = (s || "").toUpperCase();
    if (u === "AVAILABLE") return "badge bg-success";
    if (u === "PENDING") return "badge bg-warning text-dark";
    if (u === "ADOPTED") return "badge bg-secondary";
    return "badge bg-light text-dark";
  };

  const loadAll = async () => {
    const pets = await listMyPets();
    setAdoptionListings(Array.isArray(pets) ? pets : []);
    setRequests((Array.isArray(pets) ? pets : []).filter(
      (p) => (p.adoptionStatus || "").toUpperCase() === "PENDING"
    ));
  };
  useEffect(() => { loadAll(); }, []);

  const handleApprove = async (petId) => {
    await reviewAdoptionRequest(petId, true, "Approved");
    await loadAll();
    setViewing(null);
  };
  const handleReject = async (petId) => {
    await reviewAdoptionRequest(petId, false, "Rejected");
    await loadAll();
    setViewing(null);
  };

  // const onSubmitListing = async (data) => {
  //   const payload = {
  //     name: data.pet_name,
  //     species: data.species,
  //     breed: data.breed,
  //     notes: data.description,
  //     status: "ACTIVE",
  //   };
  //   await addPet(payload, null);
  //   reset();
  //   await loadAll();
  // };

  const updateListingStatus = async (id, statusUpper) => {
    await updateAdoptionStatus(id, statusUpper.toUpperCase());
    await loadAll();
  };

  const ageText = (birthDate) => {
    if (!birthDate) return "-";
    const bd = new Date(birthDate);
    const now = new Date();
    const months =
      (now.getFullYear() - bd.getFullYear()) * 12 +
      (now.getMonth() - bd.getMonth());
    return `${months} months`;
  };


  
  const parseJson = (val) => {
    if (!val) return null;
    if (typeof val === "object") return val;       
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return null; }
    }
    return null;
  };

  const pick = (obj, keys, fallback = null) => {
    if (!obj) return fallback;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
    }
    return fallback;
  };

  const pretty = (v) => {
    if (v === undefined || v === null) return "-";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (Array.isArray(v)) return v.length ? v.join(", ") : "-";
    return String(v);
  };

  const fmtDateTime = (s) => {
    if (!s) return "-";
    const d = new Date(s);
    return isNaN(d.getTime()) ? String(s) : d.toLocaleString();
  };

  return (
    <div className="container">
      <h1 className="mb-4">Adoption Management</h1>

      {/* Listings table */}
      <div className="card mb-4">
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
                {adoptionListings.map((p) => {
                  const s = p.adoptionStatus;
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.species}</td>
                      <td>{p.breed}</td>
                      <td>{ageText(p.birthDate)}</td>
                      <td>
                        <span className={badgeOf(s)}>{(s || "-").toLowerCase()}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => updateListingStatus(p.id, "AVAILABLE")}
                        >
                          Available
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updateListingStatus(p.id, "ADOPTED")}
                        >
                          Adopted
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {adoptionListings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No pets
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Requests table */}
      <div className="card">
        <div className="card-header">
          <h5>Adoption Requests (Pending Review)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Pet Name</th>
                  <th>Status</th>
                  <th style={{ width: 280 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        {(p.adoptionStatus || "-").toLowerCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => { console.log("viewing:", p); setViewing(p); }}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(p.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleReject(p.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No pending requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewing && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Adoption Request · {viewing.name}</h5>
                <button type="button" className="btn-close" onClick={() => setViewing(null)} />
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="mb-2">
                      <small className="text-muted">Status</small>
                      <div>
                        <span className={badgeOf(viewing.adoptionStatus)}>
                          {(viewing.adoptionStatus || "-").toLowerCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">Requested By (userId)</small>
                      <div>{viewing.adoptionRequestedBy || "-"}</div>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted">Requested At</small>
                      <div>{fmtDateTime(viewing.adoptionRequestedAt)}</div>
                    </div>
                  </div>

                  {/* Cột phải: Applicant Info lấy từ adoptionRequestJson */}
                  <div className="col-md-6">
                    <small className="text-muted d-block mb-2">Applicant Info</small>
                    {(() => {
                      const data = parseJson(viewing.adoptionRequestJson) || {};

                      const applicantName = pick(data, ["fullName", "applicantName", "name"]);
                      const phone = pick(data, ["phone", "phoneNumber", "applicantPhone"]);
                      const address = pick(data, ["address", "homeAddress"]);
                      const householdSize = pick(data, ["householdSize", "familySize"]);
                      const otherPets = pick(data, ["hasOtherPets", "otherPets", "currentPets"]);
                      const reason = pick(data, ["note", "notes", "extra"]);

                      return (
                        <>
                          <div className="border rounded p-2 bg-light">
                            <div className="row g-2">
                              <div className="col-5 text-muted">Full name</div>
                              <div className="col-7">{pretty(applicantName)}</div>

                              <div className="col-5 text-muted">Phone</div>
                              <div className="col-7">{pretty(phone)}</div>

                              <div className="col-5 text-muted">Address</div>
                              <div className="col-7">{pretty(address)}</div>

                              <div className="col-5 text-muted">Household size</div>
                              <div className="col-7">{pretty(householdSize)}</div>

                              <div className="col-5 text-muted">Has other pets</div>
                              <div className="col-7">{pretty(otherPets)}</div>

                              <div className="col-5 text-muted">Reason</div>
                              <div className="col-7">{pretty(reason)}</div>
                            </div>
                          </div>

                          <details className="mt-3">
                            <summary>View raw JSON</summary>
                            <pre className="bg-light p-2 rounded border" style={{ maxHeight: 200, overflow: "auto" }}>
                              {JSON.stringify(data, null, 2)}
                            </pre>
                          </details>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setViewing(null)}>
                  Close
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(viewing.id)}>
                  Reject
                </button>
                <button className="btn btn-success" onClick={() => handleApprove(viewing.id)}>
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
