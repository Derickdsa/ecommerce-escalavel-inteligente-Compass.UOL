# Criação da VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr
  instance_tenancy = "default"
  enable_dns_support = "true"
  enable_dns_hostnames = "true"

  tags = {
    Name = "${var.variable-uol}-vpc"
  }
}

# Criação do Internet Gateway (IGW)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.variable-uol}-igw"
  }
}

# Criação das sub-redes públicas
resource "aws_subnet" "public" {
  count = length(var.public_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = element (var.public_subnets, count.index)
  availability_zone_id = element(var.public_subnets, count.index)
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.variable-uol}-public-subnet-${count.index + 1}"
  }
}

# Criação das sub-redes privadas
resource "aws_subnet" "private" {
  count = length(var.private_subnets)
  vpc_id            = aws_vpc.main.id
  cidr_block        = element (var.private_subnets,count.index)
  availability_zone_id = element(var.private_subnets, count.index)

  tags = {
    Name = "${var.variable-uol}-private-subnet-${count.index + 1}"
  }
}

# Criação da tabela de rotas para as sub-redes públicas
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" # trafego para a internet
    gateway_id = aws_internet_gateway.igw.id # rota para o IGW
  }

    tags = {
        Name = "${var.variable-uol}-public-rt"
    }
}

# tabela de rotas para as sub-redes privadas
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.variable-uol}-private-rt"
    }
}

# associaçao das sub-redes públicas com a tabela de rotas pública
resource "aws_route_table_association" "public_assoc" {
  count = length(aws_subnet.public)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public_rt.id
}

# associaçao das sub-redes privadas com a tabela de rotas privada
resource "aws_route_table_association" "private_assoc" {
  count = length(aws_subnet.private)
  subnet_id      = element(aws_subnet.private.*.id, count.index)
  route_table_id = aws_route_table.private_rt.id
}