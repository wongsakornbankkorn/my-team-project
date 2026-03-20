import axios from 'axios';

const API_URL = 'http://localhost:5000/api/categories';

const categoryService = {
  getCategories: async () => {
    const response = await axios.get(API_URL);
    return response.data; // Backend ส่งมาเป็น { success: true, data: [...] }
  },
  
  getCategoryById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createCategory: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default categoryService;