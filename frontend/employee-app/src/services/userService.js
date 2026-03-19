import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userService = {
  // 1. ดึงข้อมูลพนักงานทั้งหมดมาแสดงในตาราง
  getUsers: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // 2. ดึงข้อมูลพนักงาน 1 คน (เผื่อใช้หน้าแก้ไข)
  getUserById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // 3. แก้ไขข้อมูลพนักงาน
  updateUser: async (id, data) => {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // 4. ลบพนักงาน
  deleteUser: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  }
};

export default userService;