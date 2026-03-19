const express = require('express');
const router = express.Router();
const {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  getLocationById,
  getLocationReport
} = require('../controllers/locationController');

// ลบ verifyToken ออกก่อนชั่วคราว
router.get('/', getAllLocations);
router.get('/report', getLocationReport);
router.get('/:id', getLocationById);
router.post('/', createLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;