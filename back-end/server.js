const express = require('express')
const cors = require('cors')
require('dotenv').config()

// 1. เปลี่ยนตรงนี้ ให้เก็บค่าที่ require มาใส่ตัวแปร sequelize
const sequelize = require('./config/db')   

const app = express()

app.use(cors())
app.use(express.json())

// นำเข้า Routes
app.use('/api/items',      require('./routes/itemRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/users',      require('./routes/userRoutes'))
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/locations',  require('./routes/locationRoutes'))

const PORT = process.env.PORT || 5000

// 2. เพิ่มบล็อกโค้ดนี้ เพื่อสั่งให้ Sequelize สร้างตารางอัตโนมัติ
sequelize.sync({ alter: true }) // alter: true จะช่วยอัปเดตตารางให้ตรงกับ Model เสมอ
  .then(() => {
    console.log('Database synced & Tables created (if not exist)')
    
    // ย้าย app.listen มาไว้ในนี้ เพื่อให้ชัวร์ว่าสร้างตารางเสร็จก่อนค่อยเปิดเซิร์ฟ
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to sync database:', err)
  })