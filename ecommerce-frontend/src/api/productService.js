// Este arquivo vai simular a busca de dados no backend.
// Quando o backend estiver pronto, você substituirá o conteúdo desta função
// por uma chamada real usando fetch() ou axios.

// Simula uma chamada de API que demora 1 segundo para responder
const mockProducts = [
  { id: 1, name: 'Notebook Gamer', price: 5999.90, imageUrl: 'https://via.placeholder.com/200' },
  { id: 2, name: 'Mouse sem Fio', price: 149.90, imageUrl: 'https://via.placeholder.com/200' },
  { id: 3, name: 'Teclado Mecânico', price: 349.50, imageUrl: 'https://via.placeholder.com/200' },
  { id: 4, name: 'Monitor 4K', price: 2500.00, imageUrl: 'https://via.placeholder.com/200' },
];

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 1000); // Atraso de 1 segundo para simular a rede
  });
};

// Quando o backend estiver pronto, a função acima ficará assim:
/*
import axios from 'axios';
const API_URL = 'http://sua-api.com/api';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
}
*/