// server.js

const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Importações dos arquivos criados
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const logger = require("./src/config/logger"); // Assumindo que você criou o logger

// Carrega variáveis de ambiente
dotenv.config();

// Inicializa o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conecta ao Banco de Dados (RDS)
connectDB();

// Middlewares
app.use(bodyParser.json());

// Rotas
app.use("/api/users", userRoutes); // Base URL para as rotas de usuário

// Rota de Teste de Saúde
app.get("/", (req, res) => {
  res.send("User Service está rodando!");
});

// Inicializa o servidor
app.listen(PORT, () => {
  logger.info(`Serviço de Usuários rodando na porta ${PORT}`);
});
