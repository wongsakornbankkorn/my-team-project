const User = require('../models/User');

// ฟังก์ชันช่วยแปลง role ข้อความ เป็นเลข (ถ้าหน้าเว็บส่งมาเป็นคำ)
const getRoleId = (roleStr) => (roleStr === 'admin' ? 1 : 2);

// สมัครสมาชิก
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // เช็คว่ามี username นี้หรือยัง
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว' });

    const newUser = await User.create({
      username,
      password, // ของจริงควรใช้ bcrypt เข้ารหัสก่อน
      role_id: getRoleId(role)
    });
    
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ', user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body; 
    
    const user = await User.findOne({ 
      where: { username, password },
      raw: true 
    });

    if (!user) return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    // ของจริงตรงนี้ควรสร้าง JWT Token แล้วส่งกลับไป (เดี๋ยวค่อยทำใน authMiddleware)
    res.json({ message: 'เข้าสู่ระบบสำเร็จ', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};