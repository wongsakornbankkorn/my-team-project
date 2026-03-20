const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2 // 2 = สิทธิ์ผู้ใช้งานทั่วไป
  }
  // ไม่ต้องใส่ regist_date ปล่อยให้ระบบจัดการเอง
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;