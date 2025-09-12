import React, { useEffect, useMemo, useState } from "react";
import { fetchAllVets, searchVets } from "../../../api/vet.js";
import BookAppointmentModal from "./BookAppointmentModal.jsx";

const VetCard = ({ vet, onBook }) => {
    return (
        <div className="col-sm-6 col-lg-4 mb-6" key={vet.userId || vet.id}>
            <div className="product-item product-item-border">
                <a className="product-thumb" href={"#"}>
                    <img
                        src="https://via.placeholder.com/300x286?text=Vet"
                        width="300"
                        height="286"
                        alt={vet.name || "Vet"}
                    />
                </a>
                <div className="product-info">
                    <h4 className="title">
                        <a href={"#"}>{vet.name || vet.fullName || "Veterinarian"}</a>
                    </h4>
                    <div className="price">
                        {vet.specialization || "General"}
                        {typeof vet.yearsExperience === "number" && (
                            <span className="price-old"> {" "}{vet.yearsExperience} yrs</span>
                        )}
                    </div>
                    <div style={{ fontSize: 13, color: "#666" }}>
                        {vet.clinicAddress || ""}
                    </div>
                    <button
                        type="button"
                        className="info-btn-wishlist"
                        title="Book appointment"
                        onClick={() => onBook(vet)}
                        style={{ marginTop: 8 }}
                    >
                        <i className="fa fa-calendar" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function AllVets() {
    const [loading, setLoading] = useState(true);
    const [allVets, setAllVets] = useState([]);
    const [vets, setVets] = useState([]);
    const [query, setQuery] = useState("");
    const [province, setProvince] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [modalVet, setModalVet] = useState(null);

    const hasFilters = useMemo(
        () => !!(query || province || specialization),
        [query, province, specialization]
    );

    useEffect(() => {
        let active = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchAllVets();
                const list = Array.isArray(data) ? data : [];
                if (active) {
                    setAllVets(list);
                    setVets(list);
                }
            } catch {
                if (active) {
                    setAllVets([]);
                    setVets([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        })();
        return () => { active = false; };
    }, []);

    // If filters are cleared manually, auto-restore full list without refetch
    useEffect(() => {
        if (!loading && !hasFilters) {
            setVets(allVets);
        }
    }, [hasFilters, loading, allVets]);

    const doSearch = async (e) => {
        e?.preventDefault?.();
        if (!hasFilters) {
            setVets(allVets);
            return;
        }
        try {
            setLoading(true);
            const data = await searchVets({
                q: query || undefined,
                province: province || undefined,
                specialization: specialization || undefined,
            });
            setVets(Array.isArray(data) ? data : []);
        } catch {
            setVets([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setQuery("");
        setProvince("");
        setSpecialization("");
        setVets(allVets);
    };

    if (loading) return <div className="text-center">Loading vets...</div>;

    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="section-title text-center">
                    <h2 className="title">Find a Veterinarian</h2>
                    <p>Search and book an appointment.</p>
                </div>

                <form className="mb-4" onSubmit={doSearch}>
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name, clinic..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Province"
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Specialization"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                            />
                        </div>
                        <div className="col-md-2 mb-2 d-flex">
                            <button type="submit" className="btn btn-primary mr-2" style={{ marginRight: 8 }}>
                                Search
                            </button>
                            {hasFilters && (
                                <button type="button" className="btn btn-outline-secondary" onClick={clearFilters}>
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </form>

                <div className="row mb-n6">
                    {vets.map((v) => (
                        <VetCard key={v.userId || v.id} vet={v} onBook={setModalVet} />
                    ))}
                    {vets.length === 0 && (
                        <div className="col-12 text-center">No vets found.</div>
                    )}
                </div>
            </div>

            <BookAppointmentModal
                isOpen={!!modalVet}
                onClose={() => setModalVet(null)}
                vet={modalVet}
            />
        </section>
    );
}