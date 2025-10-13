// src/config/db.js

const mongoose = require("mongoose");
require("dotenv").config(); // Garante que as variáveis de ambiente sejam carregadas

const connectDB = async () => {
  // URL de conexão composta pelas variáveis do .env
  const dbUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

  try {
    await mongoose.connect(dbUri, {
      // Opções recomendadas para evitar avisos
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(
      "✅ Conexão com o RDS (via Mongoose) estabelecida com sucesso."
    );
  } catch (error) {
    console.error("❌ Falha na conexão com o Banco de Dados:", error.message);
    // O logger.error aqui é crucial para o CloudWatch!
    process.exit(1); // Encerra o processo em caso de falha crítica
  }
};

module.exports = connectDB;
