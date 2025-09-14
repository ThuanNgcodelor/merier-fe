import React, { useEffect, useState } from "react";
import {
  getVetAppointments,
  updateAppointmentStatus,
  createHealthRecord,
  uploadMedicalDocument,
  getPetHealthRecords,
} from "../../api/appointments.js";
import { getPetByIdAdmin } from "../../api/user.js";
import Swal from "sweetalert2";

export default function VetAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prescribeFor, setPrescribeFor] = useState(null);
  const [uploadFor, setUploadFor] = useState(null);
  const [petRecords, setPetRecords] = useState([]);
  const [viewFor, setViewFor] = useState(null);
  const [viewRecords, setViewRecords] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [prescriptionErrors, setPrescriptionErrors] = useState({});
  const [viewPet, setViewPet] = useState(null);
  const [petById, setPetById] = useState({});

  // Toast helper
  const toast = (icon, title) =>
    Swal.fire({
      toast: true,
      icon,
      title,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });

  const petNameOf = (pet, id) =>
    pet?.name ||
    pet?.petName ||
    pet?.nickname ||
    (id ? `Pet #${id.slice(0, 6)}` : "Pet");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getVetAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to load appointments";
      setError(msg);
      Swal.fire({ icon: "error", title: "Load failed", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      const ids = Array.from(
        new Set((appointments || []).map((a) => a.petId).filter(Boolean))
      );
      if (ids.length === 0) return setPetById({});
      const results = await Promise.all(
        ids.map((id) => getPetByIdAdmin(id).catch(() => null))
      );
      const map = {};
      results.forEach((p, idx) => {
        if (p && ids[idx]) map[ids[idx]] = p;
      });
      setPetById(map);
    };
    fetchPets();
  }, [appointments]);

  useEffect(() => {
    const init = async () => {
      if (uploadFor?.petId) {
        try {
          const list = await getPetHealthRecords(uploadFor.petId);
          setPetRecords(Array.isArray(list) ? list : []);
        } catch {
          setPetRecords([]);
        }
      } else {
        setPetRecords([]);
      }
    };
    init();
  }, [uploadFor]);

  useEffect(() => {
    const initView = async () => {
      if (viewFor?.petId) {
        try {
          setViewLoading(true);
          const [records, pet] = await Promise.all([
            getPetHealthRecords(viewFor.petId).catch(() => []),
            getPetByIdAdmin(viewFor.petId).catch(() => null),
          ]);
          setViewRecords(Array.isArray(records) ? records : []);
          setViewPet(pet);
        } finally {
          setViewLoading(false);
        }
      } else {
        setViewRecords([]);
        setViewPet(null);
      }
    };
    initView();
  }, [viewFor]);

  const confirmTextForStatus = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          title: "Confirm appointment?",
          text: "This will notify the owner the appointment is confirmed.",
          confirmText: "Confirm",
          icon: "question",
          color: "#0d6efd",
        };
      case "CANCELLED":
        return {
          title: "Cancel appointment?",
          text: "This action cannot be undone.",
          confirmText: "Cancel",
          icon: "warning",
          color: "#dc3545",
        };
      case "DONE":
        return {
          title: "Mark as completed?",
          text: "The appointment will be marked as done.",
          confirmText: "Complete",
          icon: "question",
          color: "#198754",
        };
      default:
        return {
          title: "Proceed?",
          text: `Change status to ${status}?`,
          confirmText: "OK",
          icon: "question",
          color: "#0d6efd",
        };
    }
  };

  const action = async (id, status) => {
    const meta = confirmTextForStatus(status);
    const res = await Swal.fire({
      title: meta.title,
      text: meta.text,
      icon: meta.icon,
      showCancelButton: true,
      confirmButtonText: meta.confirmText,
      cancelButtonText: "Keep",
      confirmButtonColor: meta.color,
    });
    if (!res.isConfirmed) return;

    // Loading dialog
    Swal.fire({
      title: "Updating...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await updateAppointmentStatus(id, status);
      await loadData();
      Swal.close();
      toast("success", `Appointment set to ${status}`);
    } catch (e) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: e?.response?.data?.message || `Failed to update to ${status}`,
      });
    }
  };

  const handleConfirm = (id) => action(id, "CONFIRMED");
  const handleCancel = (id) => action(id, "CANCELLED");
  const handleComplete = (id) => action(id, "DONE");

  const formatTime = (iso) => new Date(iso).toLocaleString();

  const statusClass = (s) =>
    s === "CONFIRMED"
      ? "bg-success"
      : s === "PENDING"
      ? "bg-warning text-dark"
      : s === "CANCELLED"
      ? "bg-secondary"
      : s === "DONE"
      ? "bg-primary"
      : "bg-light text-dark";

  const validatePrescription = (values) => {
    const errs = {};
    if (!values.diagnosis || values.diagnosis.trim().length < 3)
      errs.diagnosis = "Diagnosis is required (min 3 chars)";
    if (!values.treatment || values.treatment.trim().length < 3)
      errs.treatment = "Treatment is required (min 3 chars)";
    return errs;
  };

  const submitPrescription = async (e) => {
    e.preventDefault();
    if (!prescribeFor) return;
    const form = new FormData(e.target);
    const diagnosis = form.get("diagnosis");
    const treatment = form.get("treatment");
    const notes = form.get("notes");

    const errs = validatePrescription({ diagnosis, treatment });
    setPrescriptionErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const visitTime = new Date().toISOString().slice(0, 19);
    try {
      setSavingPrescription(true);

      // Show loading
      Swal.fire({
        title: "Saving record...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      await createHealthRecord({
        petId: prescribeFor.petId,
        visitTime,
        diagnosis,
        treatment,
        notes,
      });

      Swal.close();
      setPrescribeFor(null);
      toast("success", "Record saved");
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Save failed",
        text: err?.response?.data?.message || "Failed to save record",
      });
    } finally {
      setSavingPrescription(false);
    }
  };

  const submitUpload = async (e) => {
    e.preventDefault();
    if (!uploadFor) return;
    const formEl = e.target;
    const form = new FormData(formEl);
    const selectedRecordId = form.get("recordId");
    const fileInput = formEl.elements.namedItem("file");
    const file =
      fileInput && fileInput.files && fileInput.files[0]
        ? fileInput.files[0]
        : null;
    const docType = form.get("docType");

    let recordId = selectedRecordId;

    if (recordId === "__new__") {
      try {
        // Loading create record
        Swal.fire({
          title: "Creating record...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => Swal.showLoading(),
        });

        const newRec = await createHealthRecord({
          petId: uploadFor.petId,
          visitTime: new Date().toISOString().slice(0, 19),
          diagnosis: "",
          treatment: "",
          notes: "Uploaded document",
        });
        recordId = newRec.id;
        Swal.close();
      } catch (err) {
        console.error(err);
        Swal.close();
        return Swal.fire({
          icon: "error",
          title: "Create record failed",
          text: err?.response?.data?.message || "Failed to create record",
        });
      }
    }

    if (!recordId)
      return Swal.fire({
        icon: "warning",
        title: "Missing record",
        text: "Please select a record.",
      });
    if (!file)
      return Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please choose a file to upload.",
      });

    try {
      setUploadingDoc(true);

      // Loading upload
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      await uploadMedicalDocument(recordId, file, docType);
      Swal.close();
      setUploadFor(null);
      toast("success", "Document uploaded");
    } catch (err) {
      console.error(err);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err?.response?.data?.message || "Failed to upload document",
      });
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading) return <div className="container py-4">Loading...</div>;
  if (error) return <div className="container py-4 text-danger">{error}</div>;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Appointments</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadData}>
          Refresh
        </button>
      </div>

      {appointments.length === 0 && (
        <div className="alert alert-info">No appointments found.</div>
      )}

      <div className="row g-3">
        {appointments.map((app) => {
          const isPending = app.status === "PENDING";
          const isConfirmed = app.status === "CONFIRMED";
          const isFinal = app.status === "CANCELLED" || app.status === "DONE";
          const petObj = petById?.[app.petId];
          return (
            <div key={app.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 shadow-sm"
                style={{ borderRadius: 12 }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">
                        <span style={{ marginRight: 6 }}>🐾</span>
                        {petNameOf(petObj, app.petId)}
                      </h6>
                      <div className="text-muted small mb-1">
                        <span style={{ marginRight: 6 }}>👤</span>Owner #
                        {app.ownerId?.slice(0, 6)}
                      </div>
                      <div className="text-muted small mb-2">
                        <span style={{ marginRight: 6 }}>🕒</span>
                        {formatTime(app.startTime)} - {formatTime(app.endTime)}
                      </div>
                    </div>
                    <span className={`badge ${statusClass(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="small text-muted mb-3">
                    <span style={{ marginRight: 6 }}>📝</span>
                    {app.reason}
                  </div>

                  {isPending && (
                    <div className="mb-2">
                      <button
                        className="btn btn-success btn-sm w-100"
                        onClick={() => handleConfirm(app.id)}
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  )}

                  <div className="row g-2">
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                      <button
                        className="btn btn-outline-danger btn-sm w-100"
                        onClick={() => handleCancel(app.id)}
                        disabled={isFinal}
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => setPrescribeFor(app)}
                        disabled={!isConfirmed}
                      >
                        Add Prescription
                      </button>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => setUploadFor(app)}
                        disabled={!isConfirmed}
                      >
                        Upload Document
                      </button>
                    </div>
                    <div className="col-6 col-sm-6 col-md-6 col-lg-6">
                      <button
                        className="btn btn-success btn-sm w-100"
                        onClick={() => handleComplete(app.id)}
                        disabled={!isConfirmed}
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      className="btn btn-outline-dark btn-sm w-100"
                      onClick={() => setViewFor(app)}
                    >
                      View Records
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {prescribeFor && (
        <div className="vf-backdrop">
          <div
            className="vf-modal p-4 bg-white rounded shadow"
            style={{ maxWidth: 640 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Add Prescription</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setPrescribeFor(null)}
                disabled={savingPrescription}
              >
                Close
              </button>
            </div>
            <form onSubmit={submitPrescription} noValidate>
              <div className="mb-2">
                <label className="form-label">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  className={`form-control ${
                    prescriptionErrors.diagnosis ? "is-invalid" : ""
                  }`}
                  required
                />
                {prescriptionErrors.diagnosis && (
                  <div className="invalid-feedback">
                    {prescriptionErrors.diagnosis}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <label className="form-label">Treatment / Prescription</label>
                <textarea
                  name="treatment"
                  className={`form-control ${
                    prescriptionErrors.treatment ? "is-invalid" : ""
                  }`}
                  required
                />
                {prescriptionErrors.treatment && (
                  <div className="invalid-feedback">
                    {prescriptionErrors.treatment}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea name="notes" className="form-control" />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setPrescribeFor(null)}
                  disabled={savingPrescription}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={savingPrescription}
                >
                  {savingPrescription ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {uploadFor && (
        <div className="vf-backdrop">
          <div
            className="vf-modal p-4 bg-white rounded shadow"
            style={{ maxWidth: 640 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">Upload Medical Document</h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setUploadFor(null)}
                disabled={uploadingDoc}
              >
                Close
              </button>
            </div>
            <form onSubmit={submitUpload}>
              <div className="mb-2">
                <label className="form-label">Select Record</label>
                <select
                  name="recordId"
                  className="form-control"
                  required
                  disabled={uploadingDoc}
                >
                  <option value="">Choose...</option>
                  <option value="__new__">
                    Create new record for this pet
                  </option>
                  {petRecords.map((r) => (
                    <option key={r.id} value={r.id}>
                      Record #{r.id.slice(0, 6)} —{" "}
                      {new Date(r.visitTime).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="form-label">Document Type</label>
                <select
                  name="docType"
                  className="form-control"
                  disabled={uploadingDoc}
                >
                  <option value="">Default</option>
                  <option value="XRAY">X-Ray</option>
                  <option value="LAB">Lab</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">File</label>
                <input
                  type="file"
                  name="file"
                  className="form-control"
                  required
                  disabled={uploadingDoc}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setUploadFor(null)}
                  disabled={uploadingDoc}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadingDoc}
                >
                  {uploadingDoc ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewFor && (
        <div className="vf-backdrop">
          <div
            className="vf-modal p-4 bg-white rounded shadow"
            style={{ maxWidth: 720 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="m-0">
                Health Records for {petNameOf(viewPet, viewFor.petId)}
              </h5>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setViewFor(null)}
              >
                Close
              </button>
            </div>
            {viewLoading ? (
              <div>Loading records...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm table-striped align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: 160 }}>Visit Time</th>
                      <th>Diagnosis</th>
                      <th>Treatment</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewRecords.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          No records
                        </td>
                      </tr>
                    )}
                    {viewRecords.map((r) => (
                      <tr key={r.id}>
                        <td>
                          {r.visitTime
                            ? new Date(r.visitTime).toLocaleString()
                            : "-"}
                        </td>
                        <td>{r.diagnosis || "-"}</td>
                        <td>{r.treatment || "-"}</td>
                        <td>{r.notes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles for modal overlay (optional if you already have global styles)
const style = document.createElement("style");
style.innerHTML = `
.vf-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:1050}
.vf-modal{max-width:720px;width:100%}
`;
document.head.appendChild(style);
