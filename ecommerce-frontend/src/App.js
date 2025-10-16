import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <Router>
      <div>
        {/* Menu de Navegação Simples */}
        <nav>
          <ul>
            <li>
              <Link to="/">Produtos</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Cadastre-se</Link> 
            </li>
            <li>
              <Link to="/checkout">Checkout</Link> 
            </li>
          </ul>
        </nav>

        <hr />

        {/* Área onde as páginas serão renderizadas */}
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          
          <Route path="/checkout" element={<CheckoutPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;