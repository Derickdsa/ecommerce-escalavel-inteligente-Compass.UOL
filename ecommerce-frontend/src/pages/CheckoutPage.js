// /src/pages/CheckoutPage.js

import React, { useState } from 'react';
import { processPayment } from '../api/paymentService'; // Nossa API "fake" de pagamento

function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsProcessing(true);

    const paymentData = {
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      // Em um app real,enviaria também o valor total e os itens do carrinho
      amount: 199.99 // Valor de exemplo
    };

    try {
      const response = await processPayment(paymentData);
      setMessage(`Pagamento aprovado! ID da Transação: ${response.transactionId}`);
    } catch (error) {
      setMessage(`Erro no pagamento: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <h2>Pagamento - Pagamento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome no Cartão:</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Número do Cartão:</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>
        <div>
          <label>Validade (MM/AA):</label>
          <input
            type="text"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            placeholder="MM/AA"
            required
          />
        </div>
        <div>
          <label>CVV:</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            required
          />
        </div>
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processando...' : 'Pagar Agora'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CheckoutPage;