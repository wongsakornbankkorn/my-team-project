const Category = require('../models/Category')

// ดูทั้งหมด
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['notice_type_id', 'notice_type_name'],
      raw: true
    })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// เพิ่มประเภท
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    const category = await Category.create({ name, description })
    res.status(201).json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// แก้ไข
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    await Category.update({ name, description }, { where: { id } })
    res.json({ message: 'updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ลบ
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    await Category.destroy({ where: { id } })
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
}