const User = require('../models/User')
const bcrypt = require('bcryptjs')

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return res.status(404).json({ message: 'ไม่พบ User' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'ไม่พบ User' })

    const updateData = { username, role_id }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    await user.update(updateData)

    res.json({
      message: 'อัปเดต User สำเร็จ',
      user: {
        id: user.user_id,
        username: user.username,
        role_id: user.role_id
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'ไม่พบ User' })
    await user.destroy()
    res.json({ message: 'ลบ User สำเร็จ' })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser }