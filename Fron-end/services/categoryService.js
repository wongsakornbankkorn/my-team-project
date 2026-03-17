import axios from 'axios';

// ชี้ไปที่ Backend ของเรา
const API_URL = 'http://localhost:5000/api/categories';

// ดึงข้อมูลทั้งหมด (GET)
const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ดึงข้อมูล 1 ตัว (GET by ID)
const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// เพิ่มข้อมูล (POST)
const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData);
  return response.data;
};

// แก้ไขข้อมูล (PUT)
const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_URL}/${id}`, categoryData);
  return response.data;
};

// ลบข้อมูล (DELETE)
const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

const categoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;