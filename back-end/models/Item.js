const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Item = sequelize.define('items', {
  item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  item_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  item_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  notice_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'notice_type',
      key: 'notice_type_id'
    }
  },
  location_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  item_status: {
    type: DataTypes.ENUM('lost', 'found', 'returned'),
    allowNull: false,
    defaultValue: 'lost'
  },
  item_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  timestamps: false,
  freezeTableName: true
})

module.exports = Item