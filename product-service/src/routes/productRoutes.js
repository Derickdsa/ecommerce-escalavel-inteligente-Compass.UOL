const express = require("express");
const router = express.Router();
// Importe o middleware de autenticação (simulado aqui, mas deve ser importado do user-service)
const protect = require("../../user-service/src/middleware/authMiddleware");
const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");

// Rotas públicas (Leitura)
router.get("/", getAllProducts); // GET /products
router.get("/:id", getProductById); // GET /products/:id

// Rotas protegidas (Escrita - Requer autenticação de Admin)
// Nota: O `protect` precisará de lógica de Autorização (RBAC) para checar se o usuário é Admin.
router.post("/", protect, createProduct); // POST /products

module.exports = router;
