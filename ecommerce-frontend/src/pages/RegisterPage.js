// /src/pages/RegisterPage.js

import React, { useState } from 'react';
import { registerUser } from '../api/authService'; // Importa a função da nossa API "fake"

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Limpa mensagens antigas

    try {
      // Chama a função que simula o cadastro
      const response = await registerUser({ name, email, password });
      setMessage(response.message); // Exibe a mensagem de sucesso
      
    } catch (error) {
      setMessage(error.message); // Exibe a mensagem de erro
    }
  };

  return (
    <div>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;