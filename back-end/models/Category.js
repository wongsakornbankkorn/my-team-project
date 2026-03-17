const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // อ้างอิงไฟล์เชื่อมต่อ DB ของคุณ

const Category = sequelize.define('Category', {
  // ใช้ชื่อฟิลด์ให้ตรงกับที่คุณยิงใน Thunder Client
  notice_type_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'categories', // กำหนดชื่อตารางใน Database
  timestamps: true // จะสร้าง createdAt, updatedAt อัตโนมัติ
});

module.exports = Category;