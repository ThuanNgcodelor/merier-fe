import createApiInstance from '../api/createApiInstance';

const API_URL = "/v1";
const api = createApiInstance(API_URL);

class LocationService {
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }

  async findNearbyVetsByMyAddress(radiusKm = 10) {
    try {
      const response = await api.get(`/user/location/nearby/vets/my-address?radiusKm=${radiusKm}`);
      return response.data;
    } catch (error) {
      console.error('Error finding nearby vets by my address:', error);
      throw error;
    }
  }

  async findNearbyVetsByCoordinates(latitude, longitude, radiusKm = 10) {
    try {
      console.log('Calling API with:', { latitude, longitude, radiusKm });
      const response = await api.get(
        `/user/location/nearby/vets/coordinates?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
      );
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error finding nearby vets by coordinates:', error);
      throw error;
    }
  }

  async findNearbySheltersByMyAddress(radiusKm = 10) {
    try {
      const response = await api.get(`/user/location/nearby/shelters/my-address?radiusKm=${radiusKm}`);
      return response.data;
    } catch (error) {
      console.error('Error finding nearby shelters by my address:', error);
      throw error;
    }
  }

  async findNearbySheltersByCoordinates(latitude, longitude, radiusKm = 10) {
    try {
      const response = await api.get(
        `/user/location/nearby/shelters/coordinates?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`
      );
      return response.data;
    } catch (error) {
      console.error('Error finding nearby shelters by coordinates:', error);
      throw error;
    }
  }

  async geocodeAddress(address) {
    try {
      const response = await api.post('/user/location/geocode', address);
      return response.data;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  }

  async debugVetsWithLocation() {
    try {
      const response = await api.get('/user/location/debug/vets-with-location');
      return response.data;
    } catch (error) {
      console.error('Error getting vets with location:', error);
      throw error;
    }
  }
}

export default new LocationService();
