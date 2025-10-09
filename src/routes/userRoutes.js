const express = require("express");
const router = express.Router();
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");
// Simulação do Serviço de Banco de Dados (DBService)
// Na vida real, esta camada faria a comunicação com o RDS via Mongoose/Sequelize
const DBService = {
  async findUserByEmail(email) {
    /* Lógica de DB */ return null;
  },
  async createUser(email, hashedPassword) {
    /* Lógica de DB */ return { id: 1, email };
  },
};

// Rota de Registro (Sign-Up)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // 1. Verificar se o usuário já existe
  const existingUser = await DBService.findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ message: "Usuário já existe." });
  }

  // 2. Criptografar a senha
  const hashedPassword = await hashPassword(password);

  // 3. Criar usuário no banco (RDS)
  const newUser = await DBService.createUser(email, hashedPassword);

  // 4. Gerar Token (Opcional no registro, mas útil para login automático)
  const token = generateToken({ id: newUser.id, email: newUser.email });

  res.status(201).json({ message: "Registro bem-sucedido!", token });
});

// Rota de Login (Sign-In)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Encontrar o usuário
  const user = await DBService.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  // 2. Comparar a senha criptografada
  const isMatch = await comparePassword(password, user.passwordHash); // Assumindo que a hash está no DB
  if (!isMatch) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  // 3. Gerar e retornar o Token de acesso
  const token = generateToken({ id: user.id, email: user.email });

  res.json({ token });
});

module.exports = router;
