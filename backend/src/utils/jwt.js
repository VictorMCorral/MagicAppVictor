const jwt = require('jsonwebtoken');

/**
 * Generar token JWT
 * @param {object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Verificar token JWT
 * @param {string} token - Token a verificar
 * @returns {object} - Payload decodificado
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
