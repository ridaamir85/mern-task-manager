const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.route('/profile').get(protect, getProfile).patch(protect, updateProfile).delete(protect, deleteProfile);

module.exports = router;
