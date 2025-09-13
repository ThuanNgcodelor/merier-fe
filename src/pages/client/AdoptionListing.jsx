import React, { useEffect, useState, useMemo } from "react";
import { listPublicPets, requestAdoption, getPublicPet } from "../../api/pet";
import { useForm } from "react-hook-form";
import Header from "../../components/client/Header.jsx";

export default function AdoptionListing() {
  const [pets, setPets] = useState([]);
  const [active, setActive] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [banner, setBanner] = useState(null);
  const [watchingId, setWatchingId] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { register, handleSubmit, reset } = useForm();

  const imageUrlOf = (p) =>
    p.imageUrl ||
    (p.imageId ? `/v1/file-storage/get/${p.imageId}` : null) ||
    (p.primaryImageId ? `/v1/file-storage/get/${p.primaryImageId}` : null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPublicPets("AVAILABLE");
      setPets(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Load pets failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const saved = localStorage.getItem("adoption_watching_pet");
    if (saved) setWatchingId(saved);
  }, []);

  useEffect(() => {
    if (!watchingId) return;
    let timer = null;

    const tick = async () => {
      try {
        const pet = await getPublicPet(watchingId);
        const s = (pet?.adoptionStatus || "").toUpperCase();
        if (s === "ADOPTED") {
          setBanner({ type: "success", text: "🎉 Congratulations! Your adoption request has been APPROVED." });
          clearInterval(timer);
          setWatchingId(null);
          localStorage.removeItem("adoption_watching_pet");
          return;
        }
        if (s === "AVAILABLE") {
          setBanner({ type: "warning", text: "❌ Sorry! Your adoption request has been REJECTED." });
          clearInterval(timer);
          setWatchingId(null);
          localStorage.removeItem("adoption_watching_pet");
          return;
        }
      } catch (e) {
        // ignore polling errors
      }
    };

    tick();
    timer = setInterval(tick, 5000);

    return () => { if (timer) clearInterval(timer); };
  }, [watchingId]);

  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 6000);
    return () => clearTimeout(t);
  }, [banner]);

  const totalPages = Math.max(1, Math.ceil(pets.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pagedPets = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return pets.slice(start, start + pageSize);
  }, [pets, safePage, pageSize]);

  const onSubmit = async (values) => {
    if (!active) return;
    try {
      setSubmitting(true);
      setError(null);
      await requestAdoption(active.id, {
        ...values,
        householdSize:
          values.householdSize === "" || values.householdSize == null
            ? undefined
            : Number(values.householdSize),
        hasOtherPets: !!values.hasOtherPets,
      });

      setBanner({ type: "info", text: "Request sent. Waiting for shelter review..." });
      setWatchingId(active.id);
      localStorage.setItem("adoption_watching_pet", active.id);

      setActive(null);
      reset();
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Send request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <Header/>
      <main className="main-content">
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <h3 className="m-0">Adoption Listing</h3>

            <div className="d-flex align-items-center gap-2">
              <label className="me-1 text-muted">Items per page</label>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="form-select"
                style={{ width: 100 }}
                aria-label="Items per page"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>
          </div>

          {banner && <div className={`alert alert-${banner.type} mb-3`}>{banner.text}</div>}

          {error && <div className="alert alert-danger">{String(error)}</div>}

          {loading ? (
            <div className="text-muted py-5 text-center">Loading pets…</div>
          ) : (
            <>
              <div className="row g-3">
                {pagedPets.map((p) => (
                  <div className="col-sm-6 col-md-4 col-lg-4" key={p.id}>
                    <div className="card h-100 shadow-sm">
                      {imageUrlOf(p) ? (
                        <img
                          src={imageUrlOf(p)}
                          alt={p.name}
                          className="card-img-top"
                          style={{ objectFit: "cover", height: 180 }}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-light"
                          style={{ height: 180, borderBottom: "1px solid #eee" }}
                        >
                          <span className="text-muted">No image</span>
                        </div>
                      )}

                      <div className="card-body">
                        <h6 className="card-title mb-1 text-truncate">{p.name}</h6>
                        <div className="small text-muted text-truncate">
                          {p.species} {p.breed ? `· ${p.breed}` : ""}
                        </div>
                      </div>
                      <div className="card-footer bg-white border-top-0 pb-3">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => setActive(p)}
                        >
                          Adopt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {pets.length === 0 && (
                  <div className="col-12 text-center text-muted py-5">
                    No available pets
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {pets.length > 0 && (
                <nav className="mt-4 d-flex justify-content-center" aria-label="Pet pagination">
                  <ul className="pagination m-0">
                    <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                        ‹ Prev
                      </button>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link bg-white border-0">
                        Page <strong>{safePage}</strong> / {totalPages}
                      </span>
                    </li>
                    <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                        Next ›
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}

          {active && (
            <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow">
                  <div className="modal-header">
                    <h5 className="modal-title">Adopt: {active.name}</h5>
                    <button className="btn-close" onClick={() => setActive(null)} />
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-body">
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label">Full name</label>
                          <input className="form-control" {...register("fullName", { required: true })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Phone</label>
                          <input className="form-control" {...register("phone", { required: true })} />
                        </div>
                        <div className="col-6">
                          <label className="form-label">Household Size</label>
                          <input type="number" className="form-control" {...register("householdSize")} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Address</label>
                          <input className="form-control" {...register("address")} />
                        </div>
                        <div className="col-12">
                          <div className="form-check">
                            <input type="checkbox" id="hasOtherPets" className="form-check-input" {...register("hasOtherPets")} />
                            <label htmlFor="hasOtherPets" className="form-check-label">Have other pets</label>
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Reason</label>
                          <textarea rows={3} className="form-control" {...register("note")} />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setActive(null)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Sending..." : "Send Request"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
