const express = require('express')
const router  = express.Router()
const multer  = require('multer')
const path    = require('path')

// ตั้งค่าเก็บไฟล์ในโฟลเดอร์ back-end/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname)) // เช่น 1234567890-123.jpg
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },           // จำกัด 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('รับเฉพาะไฟล์รูปภาพเท่านั้น'))
  }
})

const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMonthlyReport,
  getReportByCategory
} = require('../controllers/itemController')

router.get('/report/monthly',     getMonthlyReport)
router.get('/report/by-category', getReportByCategory)

router.get('/',    getAllItems)
router.get('/:id', getItemById)
router.post('/',   upload.single('image'), createItem)  // ← เพิ่ม multer ตรงนี้
router.put('/:id', updateItem)
router.delete('/:id', deleteItem)

module.exports = router