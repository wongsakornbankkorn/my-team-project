const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign(
    { id: user.user_id, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password, role_id } = req.body

    const existing = await User.findOne({ where: { username } })
    if (existing) {
      return res.status(400).json({ message: 'Username นี้ถูกใช้งานแล้ว' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role_id: role_id || 2,
      regist_date: Math.floor(Date.now() / 1000)
    })

    const token = generateToken(newUser)

    res.status(201).json({
      message: 'สมัครสมาชิกสำเร็จ',
      token,
      user: {
        id: newUser.user_id,
        username: newUser.username,
        role_id: newUser.role_id
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })
    if (!user) {
      return res.status(400).json({ message: 'Username หรือ Password ไม่ถูกต้อง' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Username หรือ Password ไม่ถูกต้อง' })
    }

    const token = generateToken(user)

    res.json({
      message: 'Login สำเร็จ',
      token,
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

module.exports = { register, login }