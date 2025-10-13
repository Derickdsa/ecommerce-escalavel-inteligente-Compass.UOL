const { OpenAI } = require("openai");

// Inicialização da API (usa OPENAI_API_KEY do .env)
const openai = new OpenAI();

/**
 * Cria um prompt de sistema para dar contexto e um prompt de usuário
 * baseado nos dados do produto.
 * @param {string} currentProductName - Nome do produto que o usuário está olhando.
 * @param {string} productList - Lista de todos os produtos disponíveis no catálogo.
 */
async function getRecommendations(currentProductName, productList) {
  // 1. Otimização do Prompt (Engenharia de Prompt)
  const systemPrompt = `Você é um especialista em e-commerce e seu trabalho é recomendar 3 produtos 
        adicionais com base no produto atual que o cliente está visualizando. 
        As recomendações devem ser relevantes, complementares ou alternativas de alto valor. 
        A resposta DEVE ser estritamente um array JSON de 3 objetos, 
        contendo apenas 'id', 'name' e 'reasoning'.`;

  const userPrompt = `O cliente está visualizando o produto: "${currentProductName}". 
        Use ESTA lista de produtos disponíveis para a recomendação:\n${productList}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Modelo rápido e eficaz para JSON
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      // Força a saída em formato JSON
      response_format: { type: "json_object" },
    });

    // O conteúdo da resposta deve ser um JSON string
    const jsonResponse = JSON.parse(response.choices[0].message.content);
    return jsonResponse;
  } catch (error) {
    console.error("Erro ao chamar a GenAI:", error.message);
    // Em caso de erro, você pode retornar uma recomendação padrão ou vazia
    return { recommendations: [] };
  }
}

module.exports = {
  getRecommendations,
};
