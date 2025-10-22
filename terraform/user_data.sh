#!/bin/bash
# Script de inicialização (User Data)
# Este script roda na primeira inicialização da instância EC2

# 1. Instalar Node.js e NPM
sudo apt-get update -y
sudo apt-get install -y nodejs npm

# 2. Instalar o AWS CLI (necessário para ler o Secrets Manager)
sudo apt-get install -y awscli

# 3. Mudar para o diretório da aplicação e instalar dependências
# ESTA PARTE É TEMPORÁRIA: O CI/CD do seu colega fará o deploy do código final.
# Por enquanto, apenas cria um arquivo de teste.
echo "console.log('Servidor Node.js rodando!')" > /home/ubuntu/server.js