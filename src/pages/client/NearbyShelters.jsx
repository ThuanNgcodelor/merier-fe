import React, { useState } from 'react';
import LocationSearch from '../../components/client/LocationSearch';

const ShelterCard = ({ shelter }) => {
    return (
        <div className="col-12 col-sm-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm" style={{ borderRadius: 16 }}>
                <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold mb-1">
                        <span style={{ marginRight: 6 }}>🏠</span>
                        {shelter.shelterName || "Unknown Shelter"}
                    </h6>
                    <div className="text-muted small mb-1">
                        <strong>Address:</strong> {shelter.address || "No address"}
                    </div>
                    {shelter.shelterLocation && (
                        <div className="small text-muted mb-1">
                            <span style={{ marginRight: 6 }}>🏙️</span>
                            {shelter.shelterLocation.city}, {shelter.shelterLocation.district}
                        </div>
                    )}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        {shelter.verified && (
                            <span className="badge text-bg-success">
                                ✓ Verified
                            </span>
                        )}
                        {shelter.distance !== undefined && (
                            <span className="badge text-bg-primary">
                                📏 {shelter.distance.toFixed(1)} km
                            </span>
                        )}
                    </div>
                    <div className="small text-muted mb-2">
                        <span style={{ marginRight: 6 }}>📞</span>
                        {shelter.hotline || "N/A"}
                    </div>
                    <div className="small text-muted mb-2">
                        <span style={{ marginRight: 6 }}>📧</span>
                        {shelter.contactEmail || "N/A"}
                    </div>
                    {shelter.description && (
                        <div className="small text-muted mb-2" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {shelter.description}
                        </div>
                    )}
                    <div className="mt-auto">
                        <button className="btn btn-success btn-sm me-2">
                            View Profile
                        </button>
                        <button className="btn btn-outline-primary btn-sm">
                            Contact
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function NearbyShelters() {
    const [shelters, setShelters] = useState([]);
    const [showSearch, setShowSearch] = useState(true);

    const handleResults = (results) => {
        setShelters(results);
        setShowSearch(false);
    };

    const resetSearch = () => {
        setShelters([]);
        setShowSearch(true);
    };

    return (
        <section className="product-area section-space">
            <div className="container">
                <div className="section-title text-center">
                    <h2 className="title">Find Nearby Animal Shelters</h2>
                    <p>Search for animal shelters and rescue centers near your location.</p>
                </div>

                {showSearch ? (
                    <LocationSearch type="shelters" onResults={handleResults} />
                ) : (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4>Found {shelters.length} shelters nearby</h4>
                            <button onClick={resetSearch} className="btn btn-outline-secondary">
                                🔍 New Search
                            </button>
                        </div>

                        {shelters.length > 0 ? (
                            <div className="row">
                                {shelters.map((shelter) => (
                                    <ShelterCard key={shelter.userId} shelter={shelter} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <div className="alert alert-info">
                                    <h5>No shelters found</h5>
                                    <p>Try increasing the search radius or using a different location.</p>
                                    <button onClick={resetSearch} className="btn btn-primary">
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
