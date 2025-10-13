const { getRecommendations } = require("../services/recommendationService");
// Simulação de Catálogo (Na realidade, o serviço de Produtos forneceria isso)
const MOCK_CATALOG = [
  { id: "p001", name: "Notebook Ultrafino X" },
  { id: "p002", name: "Mouse Gamer RGB" },
  { id: "p003", name: "Headset Premium" },
  { id: "p004", name: "Webcam 4K" },
  { id: "p005", name: "Mochila para Laptop" },
];

const getProductRecommendations = async (req, res) => {
  // O ID do usuário (req.userId) viria do middleware de autenticação (IMPORTANTE!)
  const { productId } = req.params;

  // 1. Buscar o nome do produto atual
  const currentProduct = MOCK_CATALOG.find((p) => p.id === productId);
  if (!currentProduct) {
    return res.status(404).json({ message: "Produto não encontrado." });
  }

  // 2. Formatar o catálogo para o Prompt (string simples)
  const productListString = MOCK_CATALOG.map(
    (p) => `- ${p.id}: ${p.name}`
  ).join("\n");

  // 3. Chamar o serviço de GenAI
  const recommendations = await getRecommendations(
    currentProduct.name,
    productListString
  );

  res.json(recommendations);
};

module.exports = {
  getProductRecommendations,
};
