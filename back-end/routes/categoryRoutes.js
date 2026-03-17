const express = require('express');
const router = express.Router();

// นำเข้าฟังก์ชันทั้ง 5 ตัวมาจาก Controller
// (ถ้าตรงนี้ชื่อไม่ตรง หรือมาไม่ครบ จะทำให้เกิด Error แบบที่คุณเจอครับ)
const { 
  getCategories, 
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Route สำหรับ /api/categories (ไม่ต้องมี ID)
router.route('/')
  .get(getCategories)
  .post(createCategory);

// Route สำหรับ /api/categories/:id (ต้องมี ID)
router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;