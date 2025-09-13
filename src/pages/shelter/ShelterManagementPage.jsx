// src/pages/shelter/ShelterProfile.jsx
import React, { useEffect, useMemo, useState } from "react";
import { createOrGetShelterProfile, updateShelterProfile } from "../../api/shelter";

export default function ShelterManagementPage() {
  const [form, setForm] = useState(null);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertBox, setAlertBox] = useState({ type: null, text: null });

  useEffect(() => {
    (async () => {
      try {
        const data = await createOrGetShelterProfile();
        setForm({
          shelterName: data?.shelterName || "",
          contactEmail: data?.contactEmail || "",
          hotline: data?.hotline || "",
          address: data?.address || "",
          description: data?.description || "",
        });
      } catch (e) {
        console.error(e);
        setAlertBox({ type: "danger", text: "Failed to load shelter profile" });
      }
    })();
  }, []);

  const validate = (v) => {
    const e = {};
    if (!v.shelterName || v.shelterName.trim().length < 2) {
      e.shelterName = "Shelter name must be at least 2 characters";
    } else if (v.shelterName.length > 100) {
      e.shelterName = "Shelter name must be at most 100 characters";
    }
    if (!v.contactEmail) {
      e.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.contactEmail)) {
      e.contactEmail = "Invalid email address";
    }
    if (v.hotline && v.hotline.length > 20) {
      e.hotline = "Hotline must be at most 20 characters";
    }
    if (v.address && v.address.length > 255) {
      e.address = "Address must be at most 255 characters";
    }
    if (v.description && v.description.length > 2000) {
      e.description = "Description must be at most 2000 characters";
    }
    return e;
  };

  const currentErrors = useMemo(() => (form ? validate(form) : {}), [form]);

  if (!form) return <p>Loading profile...</p>;

  function handleChange(e) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(next));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  }

  async function handleSave() {
    const e = validate(form);
    setErrors(e);
    setTouched({
      shelterName: true,
      contactEmail: true,
      hotline: true,
      address: true,
      description: true,
    });
    if (Object.keys(e).length > 0) return;

    try {
      setSubmitting(true);
      const updated = await updateShelterProfile(form); 
      setForm({
        shelterName: updated?.shelterName || "",
        contactEmail: updated?.contactEmail || "",
        hotline: updated?.hotline || "",
        address: updated?.address || "",
        description: updated?.description || "",
      });
      setAlertBox({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      const msg =
        err?.userMessage ||
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.response?.data ||
        err?.message ||
        "Failed to update profile";
      setAlertBox({ type: "danger", text: msg });
      console.error("Shelter profile update error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">Shelter Profile</h3>

              {alertBox.text && (
                <div className={`alert alert-${alertBox.type} alert-dismissible fade show`} role="alert">
                  {alertBox.text}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAlertBox({ type: null, text: null })}
                  />
                </div>
              )}

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Shelter Name <span className="text-danger">*</span>
                  </label>
                  <input
                    name="shelterName"
                    value={form.shelterName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., 3K Animal Shelter"
                    className={`form-control ${touched.shelterName && currentErrors.shelterName ? "is-invalid" : ""}`}
                  />
                  {touched.shelterName && currentErrors.shelterName && (
                    <div className="invalid-feedback">{currentErrors.shelterName}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">
                    Contact Email <span className="text-danger">*</span>
                  </label>
                  <input
                    name="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="contact@example.com"
                    className={`form-control ${touched.contactEmail && currentErrors.contactEmail ? "is-invalid" : ""}`}
                  />
                  {touched.contactEmail && currentErrors.contactEmail && (
                    <div className="invalid-feedback">{currentErrors.contactEmail}</div>
                  )}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">Hotline</label>
                  <input
                    name="hotline"
                    value={form.hotline}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0909-xxx-xxx"
                    className={`form-control ${touched.hotline && currentErrors.hotline ? "is-invalid" : ""}`}
                  />
                  {touched.hotline && currentErrors.hotline && (
                    <div className="invalid-feedback">{currentErrors.hotline}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="123 Nguyen Trai, District 5, Ho Chi Minh City"
                    className={`form-control ${touched.address && currentErrors.address ? "is-invalid" : ""}`}
                  />
                  {touched.address && currentErrors.address && (
                    <div className="invalid-feedback">{currentErrors.address}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Introduce the shelter, services, opening hours..."
                    className={`form-control ${touched.description && currentErrors.description ? "is-invalid" : ""}`}
                  />
                  {touched.description && currentErrors.description && (
                    <div className="invalid-feedback">{currentErrors.description}</div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4 gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={submitting || Object.keys(currentErrors).length > 0}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
