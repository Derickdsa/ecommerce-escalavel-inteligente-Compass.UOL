const { verifyToken } = require("../utils/auth");

// Middleware para proteger rotas
const protect = (req, res, next) => {
  // 1. Verificar se o header de Autorização existe
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Token não fornecido." });
  }

  // 2. Extrair o Token
  const token = authHeader.split(" ")[1];

  // 3. Verificar e decodificar o Token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }

  // 4. Anexar o payload do usuário à requisição (ex: req.user.id)
  req.userId = decoded.id;
  next(); // Permite que a requisição prossiga
};

module.exports = protect;
