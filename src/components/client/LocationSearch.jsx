import React, { useState } from "react";
import locationService from "../../services/locationService";

const LocationSearch = ({ onResults, type = "vets" }) => {
  const [searchMethod, setSearchMethod] = useState("current-location");
  const [customAddress, setCustomAddress] = useState("");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      let results = [];

      switch (searchMethod) {
        case "current-location":
          try {
            const location = await locationService.getCurrentLocation();
            if (type === "vets") {
              results = await locationService.findNearbyVetsByCoordinates(
                location.latitude,
                location.longitude,
                radius
              );
            } else {
              results = await locationService.findNearbySheltersByCoordinates(
                location.latitude,
                location.longitude,
                radius
              );
            }
          } catch (geoError) {
            if (
              geoError.message.includes("denied") ||
              geoError.message.includes("permission") ||
              geoError.message.includes("blocked")
            ) {
              setError(
                'Access to the position of rejection or blocked. Please try using "my default address" or "custom address".'
              );
              return;
            } else if (geoError.message.includes("not supported")) {
              setError(
                'Your browser does not support positioning. Please try using "my default address" or "custom address".'
              );
              return;
            } else {
              setError(
                'Can not take your current position. Please try using "my default address" or "custom address".'
              );
              return;
            }
          }
          break;

        case "my-address":
          try {
            if (type === "vets") {
              results = await locationService.findNearbyVetsByMyAddress(radius);
            } else {
              results = await locationService.findNearbySheltersByMyAddress(
                radius
              );
            }
          } catch (err) {
            if (err.message.includes("not found")) {
              setError(
                'No default address found. Please add the default address in your profile or use the "custom address".'
              );
              return;
            } else {
              setError(
                'Can not find veterinarian near your default address. Please try using the "custom address".'
              );
              return;
            }
          }
          break;

        case "custom-address":
          if (!customAddress.trim()) {
            setError("Vui lòng nhập địa chỉ");
            return;
          }
          try {
            const geocoded = await locationService.geocodeAddress(
              customAddress
            );
            if (!geocoded.latitude || !geocoded.longitude) {
              setError(
                "It is not possible to find the coordinates for this address. Please try with a more specific address."
              );
              return;
            }
            if (type === "vets") {
              results = await locationService.findNearbyVetsByCoordinates(
                geocoded.latitude,
                geocoded.longitude,
                radius
              );
            } else {
              results = await locationService.findNearbySheltersByCoordinates(
                geocoded.latitude,
                geocoded.longitude,
                radius
              );
            }
          } catch (err) {
            setError(
              "Can not handle this address. Please try with another address or check your internet connection."
            );
            return;
          }
          break;

        default:
          break;
      }

      onResults(results);
    } catch (err) {
      setError(err.message || "Error occurred when searching");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-search-container mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            🔍 Find Nearby {type === "vets" ? "Veterinarians" : "Shelters"}
          </h5>

          <div className="search-method-selection mb-3">
            <label className="form-label fw-bold">Search Method:</label>
            <div className="row">
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="searchMethod"
                    id="current-location"
                    value="current-location"
                    checked={searchMethod === "current-location"}
                    onChange={(e) => setSearchMethod(e.target.value)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="current-location"
                  >
                    📍 Use Current Location
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="searchMethod"
                    id="my-address"
                    value="my-address"
                    checked={searchMethod === "my-address"}
                    onChange={(e) => setSearchMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="my-address">
                    🏠 Use My Default Address
                  </label>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="searchMethod"
                    id="custom-address"
                    value="custom-address"
                    checked={searchMethod === "custom-address"}
                    onChange={(e) => setSearchMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="custom-address">
                    ✏️ Enter Custom Address
                  </label>
                </div>
              </div>
            </div>
          </div>

          {searchMethod === "custom-address" && (
            <div className="custom-address-input mb-3">
              <label htmlFor="address" className="form-label">
                Address:
              </label>
              <input
                type="text"
                id="address"
                className="form-control"
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter full address (e.g., 123 Đường ABC, Quận 1, TP.HCM)"
              />
            </div>
          )}

          <div className="radius-selection mb-3">
            <label htmlFor="radius" className="form-label">
              Search Radius:
            </label>
            <select
              id="radius"
              className="form-select"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
            </select>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <div className="d-flex align-items-start">
                <div className="me-2">⚠️</div>
                <div className="flex-grow-1">
                  <strong>Error: {error}</strong>
                  <div className="mt-2">
                    <small>
                      <strong>💡 Instruct:</strong>
                      <ul className="mb-0 mt-1">
                        <li>
                          If the access position is denied, try using it{" "}
                          <strong>"My default address"</strong> or{" "}
                          <strong>"Custom address"</strong>
                        </li>
                        <li>
                          For custom address, use the format:{" "}
                          <strong>"Roads, districts and cities"</strong> (ví dụ:
                          "123 Nguyen Hue, Quan 1, TP.HCM")
                        </li>
                        <li>
                          Make sure you have set up the default address in the
                          lake For the option "My default address" option
                        </li>
                      </ul>
                    </small>
                    {(error.includes("denied") || error.includes("chặn")) && (
                      <div className="mt-3">
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSearchMethod("custom-address");
                              setCustomAddress(
                                "123 Nguyễn Huệ, Quận 1, TP.HCM"
                              );
                              setError("");
                            }}
                          >
                            🏙️ Try it with the address of Ho Chi Minh City Model
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {
                              setSearchMethod("my-address");
                              setError("");
                            }}
                          >
                            🏠 Try my default address
                          </button>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            💡{" "}
                            <strong>Want to use the current location?</strong>{" "}
                            Click on the lock icon next to the URL and allow
                            access Update, then refresh.
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Searching...
                </>
              ) : (
                <>🔍 Find Nearby {type === "vets" ? "Vets" : "Shelters"}</>
              )}
            </button>

            {/* Test buttons hidden for production */}
            {false && (
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={async () => {
                    setLoading(true);
                    setError("");
                    try {
                      // Test với tọa độ TP.HCM
                      const results =
                        await locationService.findNearbyVetsByCoordinates(
                          10.762622,
                          106.660172,
                          radius
                        );
                      onResults(results);
                    } catch (err) {
                      setError("Test failed: " + err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  🧪 Fast test (TP.HCM)
                </button>

                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => {
                    setSearchMethod("custom-address");
                    setCustomAddress("123 Nguyễn Huệ, Quận 1, TP.HCM");
                    setError("");
                  }}
                  disabled={loading}
                >
                  📍 Custom address test
                </button>

                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => {
                    setSearchMethod("my-address");
                    setError("");
                  }}
                  disabled={loading}
                >
                  🏠 Test the default address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;
