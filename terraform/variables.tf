# Variável para o projeto Compass
variable "variable-uol" {
    description = "Compass project"
    type        = string
    default     = "ecommerce-compass"
}

# Variável para a região AWS
variable "variable-region" {
    description = "AWS region"
    type        = string
    default     = "us-east-1, us-east-2" # usando duas regiões para alta disponibilidade
}

# Bloco CIDR da VPC
variable "vpc_cidr" {
    description = "VPC CIDR da VPC"
    type        = string
    default     = "10.0.0.0/16"
}

# Sub-redes públicas
variable "public_subnets" {
    description = "Blocos CIDR das sub-redes públicas"
    type        = list(string)
    default     = ["10.0.1.0/24", "10.0.2.0/24"] # duas sub-redes para alta disponibilidade
}

#sub-redes privadas
variable "private_subnets" {
    description = "Blocos CIDR das sub-redes privadas"
    type        = list(string)
    default     = ["10.0.10.0/24", "10.0.11.0/24"] # duas sub-redes para alta disponibilidade"]
}