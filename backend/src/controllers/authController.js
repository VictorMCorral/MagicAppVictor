const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { generateToken } = require('../utils/jwt');

/**
 * Validaciones para registro
 */
const registerValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('username')
    .isLength({ min: 3, max: 20 })
    .withMessage('El username debe tener entre 3 y 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('El username solo puede contener letras, números y guiones bajos'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
];

/**
 * Validaciones para login
 */
const loginValidation = [
  body('email')
    .custom((value) => {
      const normalized = String(value || '').trim();
      const isEmail = /.+@.+\..+/.test(normalized);
      const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(normalized);
      return isEmail || isUsername;
    })
    .withMessage('Ingresa un email o usuario válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
];

/**
 * Controlador de registro de usuario
 */
const normalizeInput = (value = '') => String(value || '').trim();

const register = async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, username, password } = req.body;
    const normalizedEmail = normalizeInput(email).toLowerCase();
    const normalizedUsername = normalizeInput(username).toLowerCase();

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { username: normalizedUsername }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email.toLowerCase()
          ? 'El email ya está registrado'
          : 'El username ya está en uso'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true
      }
    });

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    });

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario'
    });
  }
};

/**
 * Controlador de login
 */
const login = async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    const identifier = normalizeInput(email).toLowerCase();
    const sanitizedPassword = String(password || '');

    const isEmail = /.+@.+\..+/.test(identifier);

    // Buscar usuario por email o username
    const user = await prisma.user.findUnique({
      where: isEmail
        ? { email: identifier }
        : { username: identifier }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No existe un usuario registrado con ese email o usuario'
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(sanitizedPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña ingresada no coincide con el usuario'
      });
    }

    // Generar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username
    });

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión'
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        _count: {
          select: { decks: true }
        }
      }
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
};
