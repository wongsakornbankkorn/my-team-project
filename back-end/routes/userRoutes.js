const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ทุก route ต้อง Login ก่อน (protect)
router.get("/", protect, adminOnly, getAllUsers);       // Admin เท่านั้น
router.get("/:id", protect, getUserById);
router.put("/:id", protect, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser); // Admin เท่านั้น

module.exports = router;