import api from './api';

const FarbrengenService = {
  getAllFarbrengens: async () => {
    try {
      const response = await api.get('/farbrengens');
      return response.data;
    } catch (error) {
      console.error('Error fetching farbrengens:', error);
      throw error;
    }
  },

  getUpcoming: async () => {
    try {
      const response = await api.get('/farbrengens/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming farbrengens:', error);
      throw error;
    }
  },

  getFarbrengenById: async (id) => {
    try {
      const response = await api.get(`/farbrengens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching farbrengen:', error);
      throw error;
    }
  },

  createFarbrengen: async (farbrengenData) => {
    try {
      const response = await api.post('/farbrengens', farbrengenData);
      return response.data;
    } catch (error) {
      console.error('Error creating farbrengen:', error);
      throw error;
    }
  },

  updateFarbrengen: async (id, farbrengenData) => {
    try {
      const response = await api.put(`/farbrengens/${id}`, farbrengenData);
      return response.data;
    } catch (error) {
      console.error('Error updating farbrengen:', error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/farbrengens/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting farbrengen:', error);
      throw error;
    }
  }
};

export default FarbrengenService;