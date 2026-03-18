const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Item = sequelize.define('notice', {
  notice_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  notice_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  place_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notice_title: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  notice_status_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'notice',
  timestamps: false,
  freezeTableName: true
})

module.exports = Item