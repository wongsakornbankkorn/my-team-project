const Item = require('../models/Item')

// 1. ดึงข้อมูลทั้งหมด (ต้องมีตัวนี้!)
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({ raw: true })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 2. ดึงข้อมูลตาม ID (ต้องมีตัวนี้!)
const getItemById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findOne({ where: { notice_id: id }, raw: true })
    if (!item) return res.status(404).json({ message: 'ไม่พบข้อมูล' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 3. สร้างรายการใหม่ (รับ status ด้วย)
const createItem = async (req, res) => {
  try {
    const { notice_type_id, place_id, user_id, notice_title, notice_status_id } = req.body
    const item = await Item.create({ 
      notice_type_id, 
      place_id, 
      user_id, 
      notice_title, 
      notice_status_id: notice_status_id || 1 
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 4. อัปเดตข้อมูล (รับ status ด้วย)
const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const { notice_type_id, place_id, user_id, notice_title, notice_status_id } = req.body
    await Item.update(
      { notice_type_id, place_id, user_id, notice_title, notice_status_id },
      { where: { notice_id: id } }
    )
    res.json({ message: 'updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// 5. ลบข้อมูล
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    await Item.destroy({ where: { notice_id: id } })
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getMonthlyReport = async (req, res) => {
  try {
    const sequelize = require('../config/db')
    const { QueryTypes } = require('sequelize')

    const report = await sequelize.query(
      `SELECT 
        YEAR(created_at)       AS year,
        MONTH(created_at)      AS month,
        COUNT(*)               AS total,
        SUM(notice_status_id = 1) AS lost,
        SUM(notice_status_id = 2) AS found,
        SUM(notice_status_id = 3) AS returned
       FROM notice
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY year DESC, month DESC`,
      { type: QueryTypes.SELECT }
    )
    res.json(report)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMonthlyReport  
}
