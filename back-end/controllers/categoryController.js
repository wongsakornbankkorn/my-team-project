const Category = require('../models/Category');

// 1. ดึงข้อมูลหมวดหมู่ทั้งหมด
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message });
  }
};

// 2. สร้างหมวดหมู่ใหม่
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างหมวดหมู่', error: error.message });
  }
};

// 3. ดึงข้อมูลหมวดหมู่ตาม ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่นี้' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message });
  }
};

// 4. อัปเดตหมวดหมู่
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่นี้' });
    }
    
    await category.update(req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตหมวดหมู่', error: error.message });
  }
};

// 5. ลบหมวดหมู่
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'ไม่พบหมวดหมู่นี้' });
    }

    await category.destroy();
    res.status(200).json({ success: true, message: 'ลบหมวดหมู่เรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการลบหมวดหมู่', error: error.message });
  }
};