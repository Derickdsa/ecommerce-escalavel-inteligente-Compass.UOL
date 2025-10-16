

export const processPayment = (paymentData) => {
  console.log("Processando pagamento com os dados:", paymentData);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulação de validação
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        return reject(new Error('Todos os campos do cartão são obrigatórios.'));
      }

      // Para simular um pagamento recusado, usamos um número de cartão específico
      if (paymentData.cardNumber.endsWith('1234')) {
        return reject(new Error('Pagamento recusado pela operadora.'));
      }

      // Se passou nas validações, o pagamento é aprovado
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      resolve({ success: true, transactionId: transactionId });

    }, 2000); // Simula 2 segundos de processamento
  });
};