const jwt = require("jsonwebtoken");
 
const protect = (req, res, next) => {
  // ดึง token จาก Header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "ไม่มี Token กรุณา Login ก่อน" });
  }

  const token = authHeader.split(" ")[1]; // ตัด "Bearer " ออก เหลือแค่ token

  try {
    // ตรวจสอบ token ว่าถูกต้องไหม
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // แนบข้อมูล user ไปกับ request
    next(); // ผ่านได้ ไปต่อ
  } catch (error) {
    return res.status(401).json({ message: "Token ไม่ถูกต้องหรือหมดอายุ" });
  }
};

// Middleware สำหรับเช็คว่าเป็น Admin เท่านั้น
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "สิทธิ์ Admin เท่านั้น" });
  }
};

module.exports = { protect, adminOnly };