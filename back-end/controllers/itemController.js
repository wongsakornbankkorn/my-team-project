const Item = require('../models/Item')

// ดูทั้งหมด
const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({ raw: true })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ดูรายการเดียว
const getItemById = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findOne({ where: { item_id: id }, raw: true })
    if (!item) return res.status(404).json({ message: 'ไม่พบรายการ' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ค้นหาตามชื่อ
const searchItems = async (req, res) => {
  try {
    const { keyword } = req.query
    const { Op } = require('sequelize')
    const items = await Item.findAll({
      where: {
        item_name: { [Op.like]: `%${keyword || ''}%` }
      },
      raw: true
    })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// กรองตามประเภทหรือสถานะ
const filterItems = async (req, res) => {
  try {
    const { notice_type_id, item_status, location_id } = req.query
    const where = {}
    if (notice_type_id) where.notice_type_id = notice_type_id
    if (item_status)    where.item_status = item_status
    if (location_id)    where.location_id = location_id
    const items = await Item.findAll({ where, raw: true })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// เพิ่มรายการ
const createItem = async (req, res) => {
  try {
    const {
      item_name,
      item_description,
      item_image,
      notice_type_id,
      location_id,
      user_id,
      item_status,
      item_date
    } = req.body

    if (!item_name) {
      return res.status(400).json({ message: 'กรุณาระบุชื่อรายการ' })
    }

    const item = await Item.create({
      item_name,
      item_description,
      item_image,
      notice_type_id,
      location_id,
      user_id,
      item_status: item_status || 'lost',
      item_date
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// แก้ไขรายการ
const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const {
      item_name,
      item_description,
      item_image,
      notice_type_id,
      location_id,
      user_id,
      item_status,
      item_date
    } = req.body

    const item = await Item.findOne({ where: { item_id: id } })
    if (!item) return res.status(404).json({ message: 'ไม่พบรายการ' })

    await Item.update(
      { item_name, item_description, item_image, notice_type_id, location_id, user_id, item_status, item_date },
      { where: { item_id: id } }
    )
    res.json({ message: 'อัปเดตสำเร็จ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// อัปเดตเฉพาะสถานะ
const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { item_status } = req.body

    const allowed = ['lost', 'found', 'returned']
    if (!allowed.includes(item_status)) {
      return res.status(400).json({ message: 'สถานะไม่ถูกต้อง ต้องเป็น lost / found / returned' })
    }

    const item = await Item.findOne({ where: { item_id: id } })
    if (!item) return res.status(404).json({ message: 'ไม่พบรายการ' })

    await Item.update({ item_status }, { where: { item_id: id } })
    res.json({ message: 'อัปเดตสถานะสำเร็จ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// ลบรายการ
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const item = await Item.findOne({ where: { item_id: id } })
    if (!item) return res.status(404).json({ message: 'ไม่พบรายการ' })

    await Item.destroy({ where: { item_id: id } })
    res.json({ message: 'ลบสำเร็จ' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// รายงาน: สรุปจำนวนตามสถานะ
const getItemReport = async (req, res) => {
  try {
    const sequelize = require('../config/db')
    const { QueryTypes } = require('sequelize')
    const report = await sequelize.query(
      `SELECT item_status, COUNT(*) as total FROM items GROUP BY item_status`,
      { type: QueryTypes.SELECT }
    )
    const totalAll = await Item.count()
    res.json({ total: totalAll, byStatus: report })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllItems,
  getItemById,
  searchItems,
  filterItems,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
  getItemReport
}