const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'item routes ok' })
})

module.exports = router