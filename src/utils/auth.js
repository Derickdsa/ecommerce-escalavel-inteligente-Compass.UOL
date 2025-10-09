const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

// Hash da senha (Criptografia)
async function hashPassword(password) {
  // O custo (saltRounds) deve ser ajustado para o ambiente de produção
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Comparação da senha
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Geração do JWT
function generateToken(userPayload) {
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

// Verificação do JWT (Usado no Middleware)
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Token inválido ou expirado
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
