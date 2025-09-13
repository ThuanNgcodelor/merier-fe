import React from 'react';
import { Link } from 'react-router-dom';

const LocationServices = () => {
  return (
    <section className="location-services section-space" style={{ 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '4rem 0'
    }}>
      <div className="container">
        <div className="section-title text-center mb-5">
          <h2 className="title">Find Services Near You</h2>
          <p>Discover veterinarians and animal shelters in your area</p>
        </div>
        
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0 location-service-card" style={{ 
              borderRadius: 16,
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef'
            }}>
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <div className="service-icon" style={{ 
                    fontSize: '3rem', 
                    color: '#007bff',
                    marginBottom: '1rem'
                  }}>
                    🩺
                  </div>
                </div>
                <h5 className="card-title fw-bold">Find Nearby Veterinarians</h5>
                <p className="card-text text-muted">
                  Search for veterinarians near your location and book appointments easily.
                </p>
                <Link to="/nearby-vets" className="btn btn-primary w-100">
                  <i className="fas fa-search me-2"></i>
                  Find Vets Near Me
                </Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0 location-service-card" style={{ 
              borderRadius: 16,
              transition: 'all 0.3s ease',
              border: '1px solid #e9ecef'
            }}>
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <div className="service-icon" style={{ 
                    fontSize: '3rem', 
                    color: '#6f42c1',
                    marginBottom: '1rem'
                  }}>
                    📍
                  </div>
                </div>
                <h5 className="card-title fw-bold">All Veterinarians</h5>
                <p className="card-text text-muted">
                  Browse all available veterinarians and search by specialization or location.
                </p>
                <Link to="/vets" className="btn btn-outline-primary w-100">
                  <i className="fas fa-list me-2"></i>
                  View All Vets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationServices;
