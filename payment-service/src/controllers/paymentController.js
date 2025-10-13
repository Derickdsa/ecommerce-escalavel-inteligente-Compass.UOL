// Simulação de integração com um Gateway de Pagamento
const PaymentGateway = {
  async authorizeAndCapture(data) {
    // Lógica real de chamada a uma API externa (ex: Stripe, PayPal)
    // O valor do pagamento precisa ser validado

    const isSuccessful = Math.random() > 0.1; // Simulação: 90% de sucesso

    if (isSuccessful) {
      return {
        transactionId: "txn_" + Date.now(),
        status: "CAPTURED",
        success: true,
      };
    } else {
      return {
        status: "FAILED",
        message: "Cartão recusado pelo banco.",
        success: false,
      };
    }
  },
};

const processPayment = async (req, res) => {
  // Esta rota é chamada pelo Order Service (Comunicação de serviço a serviço),
  // e deve ser protegida por uma chave API interna ou IAM (responsabilidade da Infra/DevSecOps).

  const { orderId, userId, amount, paymentDetails } = req.body;

  // 1. Tentar processar no Gateway
  try {
    const gatewayResponse = await PaymentGateway.authorizeAndCapture({
      orderId,
      amount,
      // ... dados sensíveis do cartão ...
    });

    // 2. Persistir o registro da transação (mesmo que falhe)
    // Ex: PaymentModel.create({ ... })

    // 3. Retornar o resultado para o Order Service
    res.json({
      success: gatewayResponse.success,
      status: gatewayResponse.status,
    });
  } catch (error) {
    // Em caso de erro interno (API fora do ar), registrar e retornar falha
    res
      .status(500)
      .json({
        success: false,
        message: "Falha interna no processamento de pagamento.",
      });
  }
};

module.exports = { processPayment };
