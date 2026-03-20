const express = require('express')
const router = express.Router()

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMonthlyReport
} = require('../controllers/itemController')

// ต้องวาง /report/monthly ก่อน /:id เสมอ
router.get('/report/monthly', getMonthlyReport)

router.get('/',       getAllItems)
router.get('/:id',    getItemById)
router.post('/',      createItem)
router.put('/:id',    updateItem)
router.delete('/:id', deleteItem)

module.exports = router