const express = require('express');
const router = express.Router();
const {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  getLocationById
} = require('../controllers/locationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAllLocations);
router.get('/:id', verifyToken, getLocationById);
router.post('/', verifyToken, createLocation);
router.put('/:id', verifyToken, updateLocation);
router.delete('/:id', verifyToken, deleteLocation);

module.exports = router;