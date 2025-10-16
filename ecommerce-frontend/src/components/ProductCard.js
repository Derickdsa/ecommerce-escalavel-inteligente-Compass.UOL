import React from 'react';

// Recebe um 'product' e apenas o exibe
function ProductCard({ product }) {
  return (
    <div style={{ border: '1px solid #ddd', margin: '10px', padding: '10px', width: '200px' }}>
      <img src={product.imageUrl} alt={product.name} style={{ width: '100%' }} />
      <h4>{product.name}</h4>
      <p>R$ {product.price.toFixed(2)}</p>
      <button>Adicionar ao Carrinho</button>
    </div>
  );
}

export default ProductCard;