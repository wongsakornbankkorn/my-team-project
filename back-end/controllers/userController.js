const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ raw: true });
    // แปลงเลขกลับเป็นคำให้หน้าเว็บใช้ง่ายๆ
    const formattedUsers = users.map(user => ({
      ...user,
      role: user.role_id === 1 ? 'admin' : 'user'
    }));
    res.json(formattedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ where: { user_id: req.params.id }, raw: true });
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    
    user.role = user.role_id === 1 ? 'admin' : 'user';
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const updateData = { username };
    
    if (password) updateData.password = password;
    if (role) updateData.role_id = role === 'admin' ? 1 : 2;

    await User.update(updateData, { where: { user_id: req.params.id } });
    res.json({ message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({ where: { user_id: req.params.id } });
    res.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};