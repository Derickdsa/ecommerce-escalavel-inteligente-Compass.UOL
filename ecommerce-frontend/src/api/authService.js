
// Função que simula o cadastro de um novo usuário
export const registerUser = (userData) => {
  console.log("Tentando registrar o usuário com os dados:", userData);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simula uma validação simples: verifica se todos os campos foram preenchidos
      if (userData.name && userData.email && userData.password) {
        // Se o email não for "erro@teste.com", consideramos sucesso
        if (userData.email.toLowerCase() !== 'erro@teste.com') {
          resolve({ success: true, message: 'Usuário cadastrado com sucesso!' });
        } else {
          // Simula um erro vindo do backend (ex: email já existe)
          reject(new Error('Este email já está em uso.'));
        }
      } else {
        // Simula um erro de dados faltando
        reject(new Error('Todos os campos são obrigatórios.'));
      }
    }, 1000); // Simula 1 segundo de espera
  });
};

// Você pode adicionar a função de login aqui também
export const loginUser = (credentials) => {
  // ...lógica de login fake similar à de cima
};