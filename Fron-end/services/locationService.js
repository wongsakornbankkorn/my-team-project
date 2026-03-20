import axios from 'axios';

// ชี้ไปที่ Backend ของเรา
const API_URL = 'http://localhost:5000/api/locations';

// ดึงข้อมูลทั้งหมด (GET)
const getLocations = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ดึงข้อมูล 1 ตัว (GET by ID)
const getLocationById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// เพิ่มข้อมูล (POST)
const createLocation = async (locationData) => {
  const response = await axios.post(API_URL, locationData);
  return response.data;
};

// แก้ไขข้อมูล (PUT)
const updateLocation = async (id, locationData) => {
  const response = await axios.put(`${API_URL}/${id}`, locationData);
  return response.data;
};

// ลบข้อมูล (DELETE)
const deleteLocation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// ดึงรายงานแบ่งตามสถานที่ (GET)
const getLocationReport = async () => {
  const response = await axios.get(`${API_URL}/report`);
  return response.data;
};

const locationService = {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationReport,
};

export default locationService;