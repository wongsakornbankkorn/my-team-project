const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// สามารถเอา authMiddleware มาใส่คั่นตรงนี้ได้ในอนาคต เพื่อกันไม่ให้คนนอกเข้ามาดู
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;