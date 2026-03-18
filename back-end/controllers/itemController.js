const Item = require('../models/Item')

const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({ raw: true })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

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

const createItem = async (req, res) => {
  try {
    const { notice_type_id, place_id, user_id, notice_title } = req.body
    const item = await Item.create({ notice_type_id, place_id, user_id, notice_title })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateItem = async (req, res) => {
  try {
    const { id } = req.params
    const { notice_type_id, place_id, user_id, notice_title } = req.body
    await Item.update(
      { notice_type_id, place_id, user_id, notice_title },
      { where: { notice_id: id } }
    )
    res.json({ message: 'updated' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    await Item.destroy({ where: { notice_id: id } })
    res.json({ message: 'deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
}
