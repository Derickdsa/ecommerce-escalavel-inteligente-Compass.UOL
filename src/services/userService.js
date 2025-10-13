// src/services/userService.js

const User = require("../models/User");
const { hashPassword, generateToken } = require("../utils/auth");

/**
 * Registra um novo usuário no sistema.
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, token }
 */
async function registerUser(email, password) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Usuário já existe.");
  }

  const passwordHash = await hashPassword(password);

  const newUser = await User.create({
    email,
    passwordHash,
    // Você pode ter lógica para definir o primeiro usuário como 'admin' aqui
  });

  const token = generateToken({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });

  // Retorna dados seguros (sem a hash da senha)
  return {
    user: { id: newUser._id, email: newUser.email, role: newUser.role },
    token,
  };
}

/**
 * Encontra um usuário pelo email.
 * @param {string} email
 */
async function findUserByEmail(email) {
  return await User.findOne({ email });
}

module.exports = {
  registerUser,
  findUserByEmail,
};
