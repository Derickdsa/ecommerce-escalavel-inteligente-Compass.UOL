const Order = require("../models/Order");
const axios = require("axios"); // Para comunicação inter-serviços

// URLs dos outros microserviços (Definidas em .env e gerenciadas pela Infra!)
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL;

async function createNewOrder(userId, items, paymentDetails) {
  // 1. Calcular o Total e Preparar o Pedido
  const orderTotal = calculateOrderTotal(items); // Função local para cálculo

  // 2. Verificação de Estoque (Chama o Serviço de Produtos)
  try {
    // Envia o array de itens para o Product Service verificar/reservar estoque
    await axios.post(`${PRODUCT_SERVICE_URL}/products/check-stock`, { items });
  } catch (error) {
    throw new Error("Estoque insuficiente para um ou mais produtos.");
  }

  // 3. Persistir o Pedido (Status: PENDENTE)
  const newOrder = await Order.create({
    userId,
    items,
    total: orderTotal,
    status: "PENDING_PAYMENT",
  });

  // 4. Iniciar o Pagamento (Chama o Serviço de Pagamentos)
  let paymentResult;
  try {
    paymentResult = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments/process`,
      {
        orderId: newOrder._id,
        userId,
        amount: orderTotal,
        paymentDetails,
      }
    );

    // 5. Atualizar Status do Pedido com base no resultado do pagamento
    const newStatus = paymentResult.data.success
      ? "PROCESSING"
      : "PAYMENT_FAILED";
    newOrder.status = newStatus;
    await newOrder.save();

    if (!paymentResult.data.success) {
      throw new Error("Pagamento falhou.");
    }

    return newOrder;
  } catch (error) {
    // Se o pagamento falhar, o estoque deve ser liberado (compensação)
    // Isso é complexo e pode exigir Sagas ou Step Functions (BÔNUS!)
    // Aqui, apenas atualizamos o status:
    newOrder.status = "PAYMENT_FAILED";
    await newOrder.save();
    throw new Error(`Falha na transação: ${error.message}`);
  }
}

// ... outros exports
