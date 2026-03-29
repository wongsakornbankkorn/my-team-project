const express = require('express')
const cors = require('cors')
require('dotenv').config()
const sequelize = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())


const Item = require('./models/Item')
const Location = require('./models/Location')

Item.belongsTo(Location, { foreignKey: 'place_id', as: 'location' })
Location.hasMany(Item,   { foreignKey: 'place_id', as: 'items' })

app.use('/api/items',      require('./routes/itemRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/users',      require('./routes/userRoutes'))
app.use('/api/auth',       require('./routes/authRoutes'))
app.use('/api/locations',  require('./routes/locationRoutes'))

sequelize.sync({ alter: true })
  .then(() => console.log('Database synced & Tables updated! '))
  .catch(err => console.error('Sync error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Server is running')
})

const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))