// src/controllers/userController.js

const userService = require("../services/userService");
const { comparePassword, generateToken } = require("../utils/auth");
const logger = require("../config/logger"); // Importação do logger do CloudWatch

// Controller para Registro de Novo Usuário
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    const { user, token } = await userService.registerUser(email, password);

    logger.info(`Novo usuário registrado com sucesso: ${user.email}`);
    res.status(201).json({ user, token });
  } catch (error) {
    logger.warn(`Falha no registro: ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// Controller para Login de Usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Compara a senha (plain text) com a hash armazenada
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      logger.warn(`Tentativa de login falhou para o e-mail: ${email}`);
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    logger.info(`Login bem-sucedido para o usuário: ${user.email}`);
    res.json({
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    logger.error(`Erro no processo de login: ${error.message}`);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  register,
  login,
};
