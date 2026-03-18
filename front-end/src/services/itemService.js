import axios from 'axios';

// ชี้ไปที่ Backend ของถั่วพู (พอร์ต 5000)
const API_URL = 'http://localhost:5000/api/items';

const itemService = {
  // ดึงข้อมูลทั้งหมด
  getAllItems: async () => {
    const response = await axios.get(API_URL);
    return response.data; // ของถั่วพูส่งมาเป็น Array เลย (จาก res.json(items))
  },

  // ดึงข้อมูล 1 ตัว (GET by ID)
  getItemById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // สร้างข้อมูลใหม่ (POST)
  createItem: async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // อัปเดตข้อมูล (PUT)
  updateItem: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // ลบข้อมูล (DELETE)
  deleteItem: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default itemService;