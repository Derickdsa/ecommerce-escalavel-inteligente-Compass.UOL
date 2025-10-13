const Product = require("../models/Product");

// Obter todos os produtos (público)
const getAllProducts = async (req, res) => {
  try {
    // Implementar paginação e filtros aqui
    const products = await Product.find({ stockQuantity: { $gt: 0 } }); // Apenas produtos em estoque
    res.json(products);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Falha ao buscar catálogo de produtos." });
  }
};

// Criar novo produto (protegida - requer autenticação)
const createProduct = async (req, res) => {
  // Implementar validação de input
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    // Erro 400 para erro de validação (ex: campos obrigatórios ausentes)
    res
      .status(400)
      .json({ message: "Dados do produto inválidos.", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  // ... outras funções (getProductById, updateProduct, deleteProduct)
};
