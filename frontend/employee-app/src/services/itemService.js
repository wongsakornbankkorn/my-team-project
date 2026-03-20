import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items';

const itemService = {
  getAllItems: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getItemById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createItem: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  updateItem: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteItem: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default itemService;