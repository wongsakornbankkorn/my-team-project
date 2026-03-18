const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    defaultValue: 2  // สมมติ 1 = admin, 2 = user
  },
  regist_date: {
    type: DataTypes.INTEGER,
    defaultValue: () => Math.floor(Date.now() / 1000) // Unix timestamp
  }
}, {
  tableName: 'users',
  timestamps: false  // ปิด เพราะไม่มี createdAt/updatedAt
})

module.exports = User