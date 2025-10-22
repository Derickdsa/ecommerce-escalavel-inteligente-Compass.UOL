# Endpoint do RDS \ necessário pra string de conexão do Node.js
output "rds_endpoint" {
  description = "O endereço endpoint do banco de dados RDS"
  value       = aws_db_instance.main.endpoint
}

# ARN do Secret Manager \ necessário para o Node.js buscar as credenciais do banco
output "rds_secret_arn" {
  description = "O ARN do Secret Manager que contém as credenciais do banco de dados RDS"
  value       = aws_secretsmanager_secret.rds_credentials.arn
}

# o backend e o front precisam disso para se conectar ao RDS
output "application_elb_dns" {
  description = "O DNS público do Application Load Balancer para acessar a aplicação"
  value       = aws_lb.main.dns_name
}