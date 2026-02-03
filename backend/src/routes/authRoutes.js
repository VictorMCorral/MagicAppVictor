const express = require('express');
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Rutas protegidas
router.get('/profile', authenticate, getProfile);

module.exports = router;
