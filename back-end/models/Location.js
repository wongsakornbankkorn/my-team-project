const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Location = sequelize.define('Location', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'locations',
  timestamps: true
});

module.exports = Location;

const Item = require('../models/Item');
Location.hasMany(Item, { foreignKey: 'place_id', as: 'items' });