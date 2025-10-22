provider "aws" {
  region = "us-east-1"
}
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
  availability_zone = element(var.availability_zones, count.index)
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
  availability_zone = element(var.availability_zones, count.index)

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

# --- NAT GATEWAY (Saída segura para Back-end) ---

# 1. IP Elástico (EIP)
resource "aws_eip" "nat" {
  depends_on = [aws_internet_gateway.igw]
  tags = {
    Name = "${var.variable-uol}-nat-eip"
  }
}

# 2. NAT Gateway (Lançado na primeira Sub-rede Pública)
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id 
  depends_on    = [aws_internet_gateway.igw]
  tags = {
    Name = "${var.variable-uol}-nat-gateway"
  }
}

# 3. Rota para Internet na Tabela Privada (via NAT Gateway)
resource "aws_route" "private_nat_route" {
  route_table_id         = aws_route_table.private_rt.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

# 4. Security Group para o RDS (Obrigatório para ser referenciado)
resource "aws_security_group" "rds" {
  name        = "${var.variable-uol}-rds-sg"
  description = "Permite acesso ao RDS apenas do SG da aplicacao (ASG)"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.variable-uol}-rds-sg"
  }
}

# 5. Security Group da Aplicação (ASG)
resource "aws_security_group" "app" {
  name        = "${var.variable-uol}-app-sg"
  description = "Security Group da Aplicacao Node.js"
  vpc_id      = aws_vpc.main.id

  egress { # Permite que a aplicação saia para a internet via NAT Gateway
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.variable-uol}-app-sg"
  }
}

# 6. Regra de Acesso: Aplicação -> RDS
# Esta regra deve estar no SG do RDS, permitindo entrada APENAS do SG da aplicação
resource "aws_security_group_rule" "app_to_rds" {
  type                     = "ingress"
  from_port                = 5432 # Porta padrão do Postgres
  to_port                  = 5432
  protocol                 = "tcp"
  security_group_id        = aws_security_group.rds.id
  source_security_group_id = aws_security_group.app.id
}

# Geração da Senha Segura e Aleatória (recurso do provider 'random')
resource "random_password" "db_password" {
  length  = 16
  special = false #mudar para true se quiser caracteres especiais
  override_special = "!@#$%^&*"
}

# Secrets Manager para a Senha do Banco
resource "aws_secretsmanager_secret" "rds_credentials" {
  name = "${var.variable-uol}-rds-credentials"

  tags = {
    Name = "${var.variable-uol}-rds-credentials"
  }
}

# Insere a senha gerada no Secrets Manager
resource "aws_secretsmanager_secret_version" "rds_credentials_version" {
  secret_id = aws_secretsmanager_secret.rds_credentials.id
  secret_string = jsonencode({
    username = "ecommerce_user"
    password = random_password.db_password.result # REFERÊNCIA À SENHA GERADA AQUI
  })
}

# 15. Subnet Group do RDS (Necessário para o RDS usar as sub-redes privadas)
resource "aws_db_subnet_group" "rds" {
  name       = "${var.variable-uol}-db-subnet-group"
  subnet_ids = aws_subnet.private.*.id # Usa as sub-redes privadas que você criou

  tags = {
    Name = "${var.variable-uol}-db-subnet-group"
  }
}

# 16. Instância do RDS
resource "aws_db_instance" "main" {
  db_name                = "ecommerce_db"
  allocated_storage      = 20
  multi_az               = true
  engine                 = "postgres"
  instance_class         = "db.t3.small"
  username               = "ecommerce_user"
  password               = random_password.db_password.result # REFERÊNCIA À SENHA GERADA AQUI
  db_subnet_group_name   = aws_db_subnet_group.rds.name
  vpc_security_group_ids = [aws_security_group.rds.id] 
  skip_final_snapshot    = true
  publicly_accessible    = false # ESSENCIAL: Mantém o banco privado

  tags = {
    Name = "${var.variable-uol}-rds-instance"
  }
}

# --- CAMADA DE APLICAÇÃO (ELB e ASG) ---

# 1. Security Group para o ELB (Permite tráfego da internet)
resource "aws_security_group" "elb" {
  name        = "${var.variable-uol}-elb-sg"
  description = "Permite trafego HTTP/HTTPS de qualquer lugar"
  vpc_id      = aws_vpc.main.id

  # Regra de Entrada: HTTP (Porta 80)
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Regra de Saída
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.variable-uol}-elb-sg"
  }
}

# 2. Regra de Entrada (ELB -> Aplicação): Permite tráfego do ELB para o ASG (porta 8080)
resource "aws_security_group_rule" "elb_to_app" {
  type                     = "ingress"
  from_port                = 8080 # Porta que o Node.js usará
  to_port                  = 8080
  protocol                 = "tcp"
  security_group_id        = aws_security_group.app.id # Security Group da Aplicação
  source_security_group_id = aws_security_group.elb.id # Security Group do ELB
}


# 3. Application Load Balancer (ALB) - O recurso aws_lb.main que estava faltando!
resource "aws_lb" "main" {
  name               = "${var.variable-uol}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.elb.id]
  subnets            = aws_subnet.public.*.id # Nas Sub-redes Públicas
  
  tags = {
    Name = "${var.variable-uol}-alb"
  }
}

# 4. Target Group (Onde o ALB envia o tráfego)
resource "aws_lb_target_group" "app" {
  name     = "${var.variable-uol}-app-tg"
  port     = 8080
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
}

# 5. Listener (Escuta na porta 80 e envia para o Target Group)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

#-----------------------------------

# --- 1. IAM ROLE PARA O EC2/ASG ---

# 1.1. IAM Role (Define quem pode assumir a identidade - no caso, o EC2)
resource "aws_iam_role" "app_role" {
  name = "${var.variable-uol}-app-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

# 1.2. Política de Acesso ao Secrets Manager (Permite ler as credenciais do DB)
resource "aws_iam_policy" "secrets_access" {
  name        = "${var.variable-uol}-secrets-policy"
  description = "Permite que a aplicação leia segredos no Secrets Manager"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"]
        Effect   = "Allow"
        Resource = [aws_secretsmanager_secret.rds_credentials.arn]
      },
      # Adicione permissões para GenAI aqui se for usar Amazon Bedrock (ex: bedrock:*)
    ]
  })
}

# 1.3. Anexar a Política à Role (Permissões de Leitura)
resource "aws_iam_role_policy_attachment" "secrets_attach" {
  role       = aws_iam_role.app_role.name
  policy_arn = aws_iam_policy.secrets_access.arn
}

# 1.4. Anexar Políticas Gerenciadas (AWS Padrão para logs)
resource "aws_iam_role_policy_attachment" "cloudwatch_attach" {
  role       = aws_iam_role.app_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy" # Monitoramento [cite: 47, 51]
}

# 1.5. Instance Profile (O contêiner que o EC2 usa para assumir a Role)
resource "aws_iam_instance_profile" "app_profile" {
  name = "${var.variable-uol}-app-profile"
  role = aws_iam_role.app_role.name
}

# --- 2. LAUNCH TEMPLATE (Modelo do Servidor) ---

# 2.1. Lançar o Template
resource "aws_launch_template" "app" {
  name_prefix   = "${var.variable-uol}-lt-"
  image_id      = "ami-0360c520857e3138f"
  instance_type = "t3.micro" # O tamanho da sua instância ASG

  network_interfaces {
    associate_public_ip_address = false # Não tem IP Público, usa o NAT Gateway
    security_groups             = [aws_security_group.app.id]
  }

  iam_instance_profile {
    arn = aws_iam_instance_profile.app_profile.arn
  }

  # User Data: Script que o EC2 executa na inicialização para instalar dependências
  user_data = base64encode(templatefile("${path.module}/user_data.sh", {})) 
  # O script 'user_data.sh' será criado no próximo passo!
}

# 6. Auto Scaling Group (ASG) - Estrutura básica
# (ATENÇÃO: Este recurso depende de um Launch Template e IAM Role)
resource "aws_autoscaling_group" "main" {
  name                      = "${var.variable-uol}-asg"
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
  max_size                  = 3
  min_size                  = 1
  desired_capacity          = 1
  vpc_zone_identifier       = aws_subnet.private.*.id # Nas Sub-redes Privadas!
  target_group_arns         = [aws_lb_target_group.app.arn]
  
tag {
    key                 = "Name"
    value               = "${var.variable-uol}-app-server"
    propagate_at_launch = true
  }
}