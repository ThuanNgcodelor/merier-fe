import React, { useEffect, useState } from "react";
import { getMyVetProfile, updateMyVetProfile } from "../../api/vet.js";

export default function VetProfile() {
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [hours, setHours] = useState({
    mon: { enabled: false, start: "", end: "" },
    tue: { enabled: false, start: "", end: "" },
    wed: { enabled: false, start: "", end: "" },
    thu: { enabled: false, start: "", end: "" },
    fri: { enabled: false, start: "", end: "" },
    sat: { enabled: false, start: "", end: "" },
    sun: { enabled: false, start: "", end: "" },
  });
  const [alertBox, setAlertBox] = useState({ type: null, text: null });

  useEffect(() => {
    getMyVetProfile().then((data) => {
      setForm({
        userId: data.userId,
        specialization: data.specialization || "",
        clinicAddress: data.clinicAddress || "",
        yearsExperience: data.yearsExperience ?? 0,
        bio: data.bio || "",
        availableHoursJson: data.availableHoursJson,
      });
      try {
        const parsed = data?.availableHoursJson ? JSON.parse(data.availableHoursJson) : {};
        const make = (val) => {
          if (!val || typeof val !== "string") return { enabled: false, start: "", end: "" };
          const parts = val.split("-");
          if (parts.length !== 2) return { enabled: false, start: "", end: "" };
          const start = parts[0].trim();
          const end = parts[1].trim();
          return { enabled: true, start, end };
        };
        setHours({
          mon: make(parsed.mon),
          tue: make(parsed.tue),
          wed: make(parsed.wed),
          thu: make(parsed.thu),
          fri: make(parsed.fri),
          sat: make(parsed.sat),
          sun: make(parsed.sun),
        });
      } catch (_) {
        // ignore malformed JSON; keep defaults
      }
    });
  }, []);

  if (!form) return <p>Loading profile...</p>;

  function validate(values) {
    const e = {};
    if (!values.specialization || values.specialization.trim().length === 0) {
      e.specialization = "Specialization is required";
    } else if (values.specialization.length > 100) {
      e.specialization = "Specialization must be ≤ 100 characters";
    }

    if (values.clinicAddress && values.clinicAddress.length > 200) {
      e.clinicAddress = "Clinic address must be ≤ 200 characters";
    }

    if (values.yearsExperience === null || values.yearsExperience === undefined || values.yearsExperience === "") {
      e.yearsExperience = "Years of experience is required";
    } else if (Number.isNaN(Number(values.yearsExperience))) {
      e.yearsExperience = "Years of experience must be a number";
    } else if (Number(values.yearsExperience) < 0) {
      e.yearsExperience = "Years of experience cannot be negative";
    } else if (!Number.isInteger(Number(values.yearsExperience))) {
      e.yearsExperience = "Years of experience must be an integer";
    }

    if (values.bio && values.bio.length > 1000) {
      e.bio = "Biography must be ≤ 1000 characters";
    }

    // day-by-day validation
    const dayKeys = ["mon","tue","wed","thu","fri","sat","sun"];
    for (const k of dayKeys) {
      const h = hours[k];
      if (h.enabled) {
        if (!h.start || !h.end) {
          e[`hours_${k}`] = "Select start and end time";
        } else if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(h.start) || !/^([01]?\d|2[0-3]):[0-5]\d$/.test(h.end)) {
          e[`hours_${k}`] = "Use HH:MM format";
        } else if (h.start >= h.end) {
          e[`hours_${k}`] = "End time must be after start time";
        }
      }
    }
    return e;
  }

  function handleChange(e) {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value,
    });
    setTouched({ ...touched, [name]: true });
    const next = { ...form, [name]: type === "number" ? Number(value) : value };
    setErrors(validate(next));
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validate(form));
  }

  function handleToggleDay(key) {
    const next = { ...hours, [key]: { ...hours[key], enabled: !hours[key].enabled } };
    if (!next[key].enabled) {
      next[key].start = "";
      next[key].end = "";
      const nextErrors = { ...errors };
      delete nextErrors[`hours_${key}`];
      setErrors(nextErrors);
    }
    setHours(next);
  }

  function handleTimeChange(key, field, value) {
    const next = { ...hours, [key]: { ...hours[key], [field]: value } };
    setHours(next);
    // live validate the specific day
    const h = next[key];
    const errKey = `hours_${key}`;
    const nextErrors = { ...errors };
    if (h.enabled) {
      if (!h.start || !h.end) {
        nextErrors[errKey] = "Select start and end time";
      } else if (!/^([01]?\d|2[0-3]):[0-5]\d$/.test(h.start) || !/^([01]?\d|2[0-3]):[0-5]\d$/.test(h.end)) {
        nextErrors[errKey] = "Use HH:MM format";
      } else if (h.start >= h.end) {
        nextErrors[errKey] = "End time must be after start time";
      } else {
        delete nextErrors[errKey];
      }
    } else {
      delete nextErrors[errKey];
    }
    setErrors(nextErrors);
  }

  function handleSave() {
    const currentErrors = validate(form);
    setErrors(currentErrors);
    setTouched({
      specialization: true,
      clinicAddress: true,
      yearsExperience: true,
      bio: true,
      availableHoursJson: true,
    });
    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    // build available hours JSON only with enabled days
    const available = {};
    Object.entries(hours).forEach(([k, v]) => {
      if (v.enabled && v.start && v.end) available[k] = `${v.start}-${v.end}`;
    });

    const payload = {
      specialization: form.specialization || "",
      clinicAddress: form.clinicAddress || "",
      yearsExperience: Number(form.yearsExperience) || 0,
      bio: form.bio || "",
      availableHoursJson: JSON.stringify(available),
    };
    setSubmitting(true);
    updateMyVetProfile(payload)
      .then(() => setAlertBox({ type: "success", text: "Profile updated successfully" }))
      .catch((err) => {
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Unknown error";
        setAlertBox({ type: "danger", text: `Update failed: ${msg}` });
        console.error("Vet profile update error:", err);
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">Vet Profile</h3>
              {alertBox.text && (
                <div className={`alert alert-${alertBox.type} alert-dismissible fade show`} role="alert">
                  {alertBox.text}
                  <button type="button" className="btn-close" onClick={() => setAlertBox({ type: null, text: null })}></button>
                </div>
              )}
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Specialization <span className="text-danger">*</span></label>
                  <input
                    name="specialization"
                    value={form.specialization || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Surgery, Dermatology"
                    className={`form-control ${touched.specialization && errors.specialization ? "is-invalid" : ""}`}
                  />
                  {touched.specialization && errors.specialization && (
                    <div className="invalid-feedback">{errors.specialization}</div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Clinic Address</label>
                  <input
                    name="clinicAddress"
                    value={form.clinicAddress || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Street, City, Province"
                    className={`form-control ${touched.clinicAddress && errors.clinicAddress ? "is-invalid" : ""}`}
                  />
                  {touched.clinicAddress && errors.clinicAddress && (
                    <div className="invalid-feedback">{errors.clinicAddress}</div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Years of Experience <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    name="yearsExperience"
                    value={form.yearsExperience ?? 0}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={0}
                    step={1}
                    className={`form-control ${touched.yearsExperience && errors.yearsExperience ? "is-invalid" : ""}`}
                  />
                  {touched.yearsExperience && errors.yearsExperience && (
                    <div className="invalid-feedback">{errors.yearsExperience}</div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label">Biography</label>
                  <textarea
                    name="bio"
                    value={form.bio || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    placeholder="Short professional bio (max 1000 characters)"
                    className={`form-control ${touched.bio && errors.bio ? "is-invalid" : ""}`}
                  />
                  {touched.bio && errors.bio && (
                    <div className="invalid-feedback">{errors.bio}</div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label">Available Hours</label>
                  <div className="row g-3">
                    {[
                      { key: "mon", label: "Monday" },
                      { key: "tue", label: "Tuesday" },
                      { key: "wed", label: "Wednesday" },
                      { key: "thu", label: "Thursday" },
                      { key: "fri", label: "Friday" },
                      { key: "sat", label: "Saturday" },
                      { key: "sun", label: "Sunday" },
                    ].map((d) => (
                      <div key={d.key} className="col-12">
                        <div className="row g-2 align-items-center">
                          <div className="col-12 col-md-3">
                            <div className="form-check form-switch">
                              <input
                                id={`switch-${d.key}`}
                                className="form-check-input"
                                type="checkbox"
                                checked={hours[d.key].enabled}
                                onChange={() => handleToggleDay(d.key)}
                              />
                              <label className="form-check-label ms-2" htmlFor={`switch-${d.key}`}>
                                {d.label}
                              </label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4">
                            <div className="form-floating">
                              <input
                                type="time"
                                className={`form-control ${errors[`hours_${d.key}`] ? "is-invalid" : ""}`}
                                value={hours[d.key].start}
                                onChange={(e) => handleTimeChange(d.key, "start", e.target.value)}
                                disabled={!hours[d.key].enabled}
                              />
                              <label>Start</label>
                            </div>
                          </div>
                          <div className="col-6 col-md-4">
                            <div className="form-floating">
                              <input
                                type="time"
                                className={`form-control ${errors[`hours_${d.key}`] ? "is-invalid" : ""}`}
                                value={hours[d.key].end}
                                onChange={(e) => handleTimeChange(d.key, "end", e.target.value)}
                                disabled={!hours[d.key].enabled}
                              />
                              <label>End</label>
                            </div>
                          </div>
                            <div className="col-12 col-md-4">
                            {errors[`hours_${d.key}`] && (
                              <div className="text-danger small">{errors[`hours_${d.key}`]}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-4 gap-2">
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={submitting || Object.keys(validate(form)).length > 0 || Object.keys(errors).some(k => k.startsWith("hours_"))}
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
