const express = require('express')
const router = express.Router()
const {
  getAllItems,
  getItemById,
  searchItems,
  filterItems,
  createItem,
  updateItem,
  updateItemStatus,
  deleteItem,
  getItemReport
} = require('../controllers/itemController')

// รายงาน (ต้องมาก่อน /:id เพื่อกัน conflict)
router.get('/report', getItemReport)

// ค้นหา และกรอง
router.get('/search', searchItems)        // ?keyword=กระเป๋า
router.get('/filter', filterItems)        // ?item_status=lost&notice_type_id=1

// CRUD
router.get('/',             getAllItems)
router.get('/:id',          getItemById)
router.post('/',            createItem)
router.put('/:id',          updateItem)
router.patch('/:id/status', updateItemStatus)
router.delete('/:id',       deleteItem)

module.exports = router