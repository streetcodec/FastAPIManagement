import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const login = async (credentials) => {
  const response = await api.post('/token', credentials, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users/', userData);
  return response.data;
};

// Car services
export const carService = {
  getAllCars: async (search = '') => {
    try {
      const response = await api.get('/cars/', {
        params: { search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },

  getCarById: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/cars/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching car:', error);
      throw error;
    }
  },

  createCar: async (carData) => {
    try {
      const response = await api.post('/cars/', carData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  updateCar: async (id, carData) => {
    try {
      // Remove any undefined or null values
      const cleanData = Object.fromEntries(
        Object.entries(carData).filter(([_, v]) => v != null)
      );
      
      const response = await api.put(`/cars/${id}`, cleanData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  },

  deleteCar: async (id) => {
    try {
      await api.delete(`/cars/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Error deleting car:', error);
      throw error;
    }
  }
};

export default api; 