// src/pages/shelter/PetManagementPage.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  listMyPets,
  addPet,
  updatePet,
  deletePet,
  reviewAdoptionRequest,
} from "../../api/pet";

function msg(error, fallback = "Request failed") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  try { return JSON.stringify(data) || fallback; } catch { return fallback; }
}

const normalize = (v) => ({
  name: v.name?.trim(),
  species: v.species?.trim(),
  breed: v.breed || null,
  birthDate: v.birthDate || null,                 // "" -> null
  gender: v.gender || "UNKNOWN",
  color: v.color || null,
  weightKg: v.weightKg === "" ? null : Number(v.weightKg),
  microchipNumber: v.microchipNumber || null,
  vaccinated: v.vaccinated ?? null,
  sterilized: v.sterilized ?? null,
  lastVetVisit: v.lastVetVisit || null,
  notes: v.notes || null,
  primaryImageId: v.primaryImageId || null,
  status: v.status || null,                       // BE sẽ default ACTIVE nếu null
});

export default function PetManagementPage() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      birthDate: "",
      gender: "UNKNOWN",
      color: "",
      weightKg: "",
      microchipNumber: "",
      vaccinated: false,
      sterilized: false,
      lastVetVisit: "",
      notes: "",
      primaryImageId: "",
      status: "",
    },
  });

  const [file, setFile] = useState(null);
  const [pets, setPets] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      setLoading(true); setErr(null);
      const data = await listMyPets();
      setPets(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(msg(e));
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      setLoading(true); setErr(null);
      const payload = normalize(values);                // << QUAN TRỌNG
      if (editing) {
        await updatePet(editing.id, payload, file || null);
      } else {
        await addPet(payload, file || null);
      }
      reset();
      setFile(null);
      setEditing(null);
      await load();
    } catch (e) {
      setErr(msg(e));
    } finally { setLoading(false); }
  };

  const onEdit = (p) => {
    reset({
      name: p.name || "",
      species: p.species || "",
      breed: p.breed || "",
      birthDate: p.birthDate || "",
      gender: p.gender || "UNKNOWN",
      color: p.color || "",
      weightKg: p.weightKg ?? "",
      microchipNumber: p.microchipNumber || "",
      vaccinated: p.vaccinated ?? false,
      sterilized: p.sterilized ?? false,
      lastVetVisit: p.lastVetVisit || "",
      notes: p.notes || "",
      primaryImageId: p.primaryImageId || "",
      status: p.status || "",
    });
    setEditing(p);
    setFile(null);
  };

  const onApprove = async (p) => {
    if (p.adoptionStatus !== "PENDING") return;
    try { await reviewAdoptionRequest(p.id, true, "Approved"); await load(); }
    catch (e) { setErr(msg(e)); }
  };

  const onReject = async (p) => {
    if (p.adoptionStatus !== "PENDING") return;
    try { await reviewAdoptionRequest(p.id, false, "Rejected"); await load(); }
    catch (e) { setErr(msg(e)); }
  };

  const imageUrlOf = (p) =>
    p.imageUrl ||
    (p.imageId ? `/v1/file-storage/get/${p.imageId}` : null) ||
    (p.primaryImageId ? `/v1/file-storage/get/${p.primaryImageId}` : null);

  return (
    <div className="container py-3">
      <h3>Shelter · Pet Management</h3>
      {err && <div className="alert alert-danger">{String(err)}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="card p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <input className="form-control" {...register("name", { required: true })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Species</label>
            <input className="form-control" {...register("species", { required: true })} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Breed</label>
            <input className="form-control" {...register("breed")} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Birth Date</label>
            <input type="date" className="form-control" {...register("birthDate")} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Gender</label>
            <select className="form-select" {...register("gender")}>
              <option value="UNKNOWN">UNKNOWN</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Color</label>
            <input className="form-control" {...register("color")} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Weight (kg)</label>
            <input type="number" step="0.01" className="form-control" {...register("weightKg")} />
          </div>

          <div className="col-md-4">
            <label className="form-label">Image</label>
            <input type="file" className="form-control"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          {/* Optional fields */}
          <div className="col-md-4">
            <label className="form-label">Microchip</label>
            <input className="form-control" {...register("microchipNumber")} />
          </div>
          <div className="col-md-4 d-flex align-items-center gap-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" {...register("vaccinated")} id="vaccinated" />
              <label className="form-check-label" htmlFor="vaccinated">Vaccinated</label>
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-center gap-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" {...register("sterilized")} id="sterilized" />
              <label className="form-check-label" htmlFor="sterilized">Sterilized</label>
            </div>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => { setEditing(null); reset(); setFile(null); }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && <div className="text-muted">Loading...</div>}

      <div className="row g-3">
        {pets.map((p) => (
          <div className="col-md-4" key={p.id}>
            <div className="card h-100">
              {imageUrlOf(p) && (
                <img
                  src={imageUrlOf(p)}
                  alt={p.name}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: 200 }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text mb-1">
                  {p.species} · {p.breed}
                </p>
                <span
                  className={`badge ${p.adoptionStatus === "AVAILABLE"
                      ? "bg-success"
                      : p.adoptionStatus === "PENDING"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                >
                  {p.adoptionStatus}
                </span>
              </div>
              <div className="card-footer d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={async () => {
                    if (!window.confirm(`Delete ${p.name}?`)) return;
                    try {
                      await deletePet(p.id, false);
                      await load();
                    } catch (e) {
                      setErr(msg(e));
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {pets.length === 0 && !loading && (
          <div className="col-12 text-center text-muted">No pets yet</div>
        )}
      </div>
    </div>
  );
}
