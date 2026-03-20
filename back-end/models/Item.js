const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Item = sequelize.define('Item', {
  notice_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notice_title: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  notice_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  place_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  notice_status_id: {
    // 👈 ใน DB ดั้งเดิมไม่มีช่องนี้ เราสั่งให้ Sequelize สร้างเพิ่มให้เลย
    type: DataTypes.INTEGER,
    defaultValue: 1 
  }
}, {
  tableName: 'notice', // 👈 ชี้ให้ตรงกับชื่อตารางในฐานข้อมูล
  timestamps: false
});

module.exports = Item;