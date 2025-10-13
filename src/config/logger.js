const winston = require("winston");

const logger = winston.createLogger({
  level: "info", // Nível de log mínimo
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Formato JSON facilita a busca no CloudWatch
  ),
  transports: [
    // No ambiente AWS, o Node.js escreve no console,
    // e o EC2/ECS/Lambda (Configurado pela Infra) pega e envia para o CloudWatch.
    new winston.transports.Console(),
  ],
});

module.exports = logger;
