## 🛒 Desafio 4: Plataforma eCommerce Escalável e Inteligente (AWS & Compass UOL)

🎯 Objetivo do Projeto desenvolvido como parte do Desafio 4 - AI Services - AWS & Compass UOL.
O objetivo é criar uma plataforma de eCommerce robusta, segura e inteligente, utilizando arquitetura cloud-native, DevSecOps e Inteligência Artificial Generativa (GenAI).

Desenvolver uma aplicação completa de eCommerce com múltiplos módulos:

🧩 Produtos

👤 Usuários

🛍️ Pedidos

💳 Pagamentos

Integrando recomendações inteligentes de produtos com GenAI (Amazon Bedrock / OpenAI) e infraestrutura provisionada 100% via Terraform na AWS.

- 🧱 Arquitetura

A arquitetura segue as boas práticas do AWS Well-Architected Framework, priorizando:

Segurança (IAM, Secrets Manager, criptografia)

Confiabilidade (Auto Scaling, Load Balancer)

Eficiência de performance (RDS, caching)

Sustentabilidade (monitoramento e otimização de custos)

Excelência operacional (CI/CD e automação)

- 🔧 Principais Serviços AWS Utilizados

VPC, Subnets, Route Tables

EC2 (backend e frontend)

S3 (armazenamento estático)

RDS (PostgreSQL/MySQL)

ELB + ASG

CloudWatch (monitoramento e alarmes)

IAM & Secrets Manager

Amazon Bedrock / OpenAI API (GenAI)

- 🧠 Inteligência Artificial Generativa (GenAI)

O sistema utiliza IA para recomendar produtos personalizados com base no histórico e preferências do usuário.

- 🔍 Fluxo da Recomendação

Usuário realiza login.

O histórico de compras é analisado.

Uma API de GenAI (Amazon Bedrock ou OpenAI) gera recomendações personalizadas.

Os resultados são exibidos dinamicamente no frontend.

- 💻 Tecnologias Utilizadas
Este projeto utiliza um modelo de Monorepo para abrigar todas as camadas de desenvolvimento e infraestrutura:

Front-end	React	

Back-end	Node.js	

Infraestrutura	Terraform

-  ⚙️ Configuração e Execução da Infraestrutura (IaC)
Toda a infraestrutura é provisionada via Terraform.

Pré-requisitos
Instalação: Terraform CLI e AWS CLI instalados.

Autenticação: Perfil AWS configurado via SSO/Credenciais com permissões AdministratorAccess (ou similar) na conta alvo. A autenticação é forçada via variável AWS_PROFILE.