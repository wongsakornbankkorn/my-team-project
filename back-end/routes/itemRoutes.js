// เพิ่มใน destructure บนสุด
const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMonthlyReport   // ← เพิ่ม
} = require('../controllers/itemController')

// เพิ่ม route นี้ก่อน router.get('/:id', ...)
router.get('/report/monthly', getMonthlyReport)

router.get('/',       getAllItems)
router.get('/:id',    getItemById)
router.post('/',      createItem)
router.put('/:id',    updateItem)
router.delete('/:id', deleteItem)

module.exports = router