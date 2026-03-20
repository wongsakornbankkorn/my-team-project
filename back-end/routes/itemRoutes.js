const express = require('express')
const router = express.Router()

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMonthlyReport,
  getReportByCategory   // ← เพิ่ม
} = require('../controllers/itemController')

// static routes ต้องอยู่ก่อน /:id เสมอ
router.get('/report/monthly',     getMonthlyReport)
router.get('/report/by-category', getReportByCategory)   // ← เพิ่ม

router.get('/',       getAllItems)
router.get('/:id',    getItemById)
router.post('/',      createItem)
router.put('/:id',    updateItem)
router.delete('/:id', deleteItem)

module.exports = router