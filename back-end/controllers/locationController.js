const Location = require('../models/Location');

// เพิ่มข้อมูลสถานที่
const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;
    const location = await Location.create({ name, description });
    res.status(201).json({ message: 'เพิ่มสถานที่สำเร็จ', data: location });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// แก้ไขข้อมูลสถานที่
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'ไม่พบสถานที่' });
    await location.update({ name, description });
    res.json({ message: 'แก้ไขสถานที่สำเร็จ', data: location });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ลบข้อมูลสถานที่
const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'ไม่พบสถานที่' });
    await location.destroy();
    res.json({ message: 'ลบสถานที่สำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดึงข้อมูลสถานที่ทั้งหมด
const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json({ data: locations });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

// ดึงข้อมูลสถานที่ตาม id
const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    if (!location) return res.status(404).json({ message: 'ไม่พบสถานที่' });
    res.json({ data: location });
  } catch (err) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: err.message });
  }
};

module.exports = {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  getLocationById
};