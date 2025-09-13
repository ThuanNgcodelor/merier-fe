import React, { useState } from 'react';
import locationService from '../../services/locationService';

const LocationSearch = ({ onResults, type = 'vets' }) => {
  const [searchMethod, setSearchMethod] = useState('current-location');
  const [customAddress, setCustomAddress] = useState('');
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      let results = [];

      switch (searchMethod) {
        case 'current-location':
          try {
            const location = await locationService.getCurrentLocation();
            if (type === 'vets') {
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
            if (geoError.message.includes('denied') || geoError.message.includes('permission') || geoError.message.includes('blocked')) {
              setError('Quyền truy cập vị trí bị từ chối hoặc bị chặn. Vui lòng thử sử dụng "Địa chỉ mặc định của tôi" hoặc "Địa chỉ tùy chỉnh".');
              return;
            } else if (geoError.message.includes('not supported')) {
              setError('Trình duyệt của bạn không hỗ trợ định vị. Vui lòng thử sử dụng "Địa chỉ mặc định của tôi" hoặc "Địa chỉ tùy chỉnh".');
              return;
            } else {
              setError('Không thể lấy vị trí hiện tại của bạn. Vui lòng thử sử dụng "Địa chỉ mặc định của tôi" hoặc "Địa chỉ tùy chỉnh".');
              return;
            }
          }
          break;

        case 'my-address':
          try {
            if (type === 'vets') {
              results = await locationService.findNearbyVetsByMyAddress(radius);
            } else {
              results = await locationService.findNearbySheltersByMyAddress(radius);
            }
          } catch (err) {
            if (err.message.includes('not found')) {
              setError('Không tìm thấy địa chỉ mặc định. Vui lòng thêm địa chỉ mặc định trong hồ sơ của bạn hoặc sử dụng tùy chọn "Địa chỉ tùy chỉnh".');
              return;
            } else {
              setError('Không thể tìm thấy bác sĩ thú y gần địa chỉ mặc định của bạn. Vui lòng thử sử dụng tùy chọn "Địa chỉ tùy chỉnh".');
              return;
            }
          }
          break;

        case 'custom-address':
          if (!customAddress.trim()) {
            setError('Vui lòng nhập địa chỉ');
            return;
          }
          try {
            const geocoded = await locationService.geocodeAddress(customAddress);
            if (!geocoded.latitude || !geocoded.longitude) {
              setError('Không thể tìm thấy tọa độ cho địa chỉ này. Vui lòng thử với địa chỉ cụ thể hơn.');
              return;
            }
            if (type === 'vets') {
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
            setError('Không thể xử lý địa chỉ này. Vui lòng thử với địa chỉ khác hoặc kiểm tra kết nối internet của bạn.');
            return;
          }
          break;

        default:
          break;
      }

      onResults(results);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-search-container mb-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">🔍 Find Nearby {type === 'vets' ? 'Veterinarians' : 'Shelters'}</h5>
          
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
                    checked={searchMethod === 'current-location'}
                    onChange={(e) => setSearchMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="current-location">
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
                    checked={searchMethod === 'my-address'}
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
                    checked={searchMethod === 'custom-address'}
                    onChange={(e) => setSearchMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="custom-address">
                    ✏️ Enter Custom Address
                  </label>
                </div>
              </div>
            </div>
          </div>

          {searchMethod === 'custom-address' && (
            <div className="custom-address-input mb-3">
              <label htmlFor="address" className="form-label">Address:</label>
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
            <label htmlFor="radius" className="form-label">Search Radius:</label>
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
                  <strong>Lỗi: {error}</strong>
                  <div className="mt-2">
                    <small>
                      <strong>💡 Hướng dẫn:</strong>
                      <ul className="mb-0 mt-1">
                        <li>Nếu quyền truy cập vị trí bị từ chối, hãy thử sử dụng <strong>"Địa chỉ mặc định của tôi"</strong> hoặc <strong>"Địa chỉ tùy chỉnh"</strong></li>
                        <li>Đối với địa chỉ tùy chỉnh, hãy sử dụng định dạng: <strong>"Đường, Quận, Thành phố"</strong> (ví dụ: "123 Nguyễn Huệ, Quận 1, TP.HCM")</li>
                        <li>Hãy đảm bảo bạn đã thiết lập địa chỉ mặc định trong hồ sơ cho tùy chọn "Địa chỉ mặc định của tôi"</li>
                      </ul>
                    </small>
                    {(error.includes('denied') || error.includes('chặn')) && (
                      <div className="mt-3">
                        <div className="d-flex gap-2 flex-wrap">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setSearchMethod('custom-address');
                              setCustomAddress('123 Nguyễn Huệ, Quận 1, TP.HCM');
                              setError('');
                            }}
                          >
                            🏙️ Thử với địa chỉ TP.HCM mẫu
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-success"
                            onClick={() => {
                              setSearchMethod('my-address');
                              setError('');
                            }}
                          >
                            🏠 Thử địa chỉ mặc định của tôi
                          </button>
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">
                            💡 <strong>Muốn sử dụng vị trí hiện tại?</strong> Click vào icon khóa bên cạnh URL và cho phép truy cập vị trí, sau đó refresh trang.
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
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Searching...
                </>
              ) : (
                <>
                  🔍 Find Nearby {type === 'vets' ? 'Vets' : 'Shelters'}
                </>
              )}
            </button>
            
            {/* Test buttons hidden for production */}
            {false && (
              <div className="d-flex gap-2 flex-wrap">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={async () => {
                    setLoading(true);
                    setError('');
                    try {
                      // Test với tọa độ TP.HCM
                      const results = await locationService.findNearbyVetsByCoordinates(
                        10.762622, 106.660172, radius
                      );
                      onResults(results);
                    } catch (err) {
                      setError('Test failed: ' + err.message);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  🧪 Test nhanh (TP.HCM)
                </button>
                
                <button
                  className="btn btn-outline-info btn-sm"
                  onClick={() => {
                    setSearchMethod('custom-address');
                    setCustomAddress('123 Nguyễn Huệ, Quận 1, TP.HCM');
                    setError('');
                  }}
                  disabled={loading}
                >
                  📍 Test địa chỉ tùy chỉnh
                </button>
                
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => {
                    setSearchMethod('my-address');
                    setError('');
                  }}
                  disabled={loading}
                >
                  🏠 Test địa chỉ mặc định
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
