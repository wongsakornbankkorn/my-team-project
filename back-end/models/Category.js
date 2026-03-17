const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Category = sequelize.define('notice_type', {
  notice_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notice_type_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false,
  freezeTableName: true
})
dule.exports = Category