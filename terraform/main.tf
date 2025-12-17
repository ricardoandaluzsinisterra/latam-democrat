# Terraform AWS EC2 Configuration for LATAM DEMOCRAT
# Free Tier Compatible - t3.micro instance (Amazon Linux 2023)
# Region: eu-west-1 (Ireland)

terraform {
  required_version = ">= 1.4.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure AWS Provider - EU West 1 (Ireland)
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

# Use the specific Amazon Linux 2023 AMI from your screenshot
data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "image-id"
    values = ["ami-09c54d172e7aa3d9a"]  # Amazon Linux 2023 for eu-west-1
  }
}

# Create VPC (Virtual Private Cloud)
resource "aws_vpc" "latam_democrat_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name    = "latam-democrat-vpc"
    Project = "LATAM DEMOCRAT"
    Student = "Ricardo Andaluz (D00262961)"
  }
}

# Create Internet Gateway
resource "aws_internet_gateway" "latam_democrat_igw" {
  vpc_id = aws_vpc.latam_democrat_vpc.id

  tags = {
    Name    = "latam-democrat-igw"
    Project = "LATAM DEMOCRAT"
  }
}

# Create Public Subnet in eu-west-1a
resource "aws_subnet" "latam_democrat_public_subnet" {
  vpc_id                  = aws_vpc.latam_democrat_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name    = "latam-democrat-public-subnet"
    Project = "LATAM DEMOCRAT"
  }
}

# Create Route Table
resource "aws_route_table" "latam_democrat_public_rt" {
  vpc_id = aws_vpc.latam_democrat_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.latam_democrat_igw.id
  }

  tags = {
    Name    = "latam-democrat-public-rt"
    Project = "LATAM DEMOCRAT"
  }
}

# Associate Route Table with Subnet
resource "aws_route_table_association" "public_subnet_association" {
  subnet_id      = aws_subnet.latam_democrat_public_subnet.id
  route_table_id = aws_route_table.latam_democrat_public_rt.id
}

# Create Security Group
resource "aws_security_group" "latam_democrat_sg" {
  name        = "latam-democrat-security-group"
  description = "Security group for LATAM DEMOCRAT web application"
  vpc_id      = aws_vpc.latam_democrat_vpc.id

  # SSH access (port 22)
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # ⚠️ Change to your IP for better security
  }

  # HTTP access (port 80)
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access (port 443)
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Node.js Backend (port 5000)
  ingress {
    description = "Node.js Backend API"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # React Dev Server (port 3000) - Optional for debugging
  ingress {
    description = "React Dev Server"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "latam-democrat-sg"
    Project = "LATAM DEMOCRAT"
  }
}

# Create SSH Key Pair (using your ace-key.pub)
resource "aws_key_pair" "latam_democrat_key" {
  key_name   = "latam-democrat-key"
  public_key = file(var.ssh_public_key_path)

  tags = {
    Name    = "latam-democrat-ssh-key"
    Project = "LATAM DEMOCRAT"
  }
}

# Create EC2 Instance (Free Tier - t3.micro for Amazon Linux 2023)
resource "aws_instance" "latam_democrat_server" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = "t3.micro"  # Free tier eligible for Amazon Linux 2023
  key_name               = aws_key_pair.latam_democrat_key.key_name
  vpc_security_group_ids = [aws_security_group.latam_democrat_sg.id]
  subnet_id              = aws_subnet.latam_democrat_public_subnet.id

  # Root volume (Free tier: up to 30GB EBS)
  root_block_device {
    volume_size           = 25  # GB - staying under 30GB free tier limit
    volume_type           = "gp3"  # gp3 is more cost-effective than gp2
    delete_on_termination = true
  }

  # User data script to initialize the server
  user_data = templatefile("${path.module}/user-data.sh", {
    mongodb_uri           = var.mongodb_uri
    cloudinary_cloud_name = var.cloudinary_cloud_name
    cloudinary_api_key    = var.cloudinary_api_key
    cloudinary_api_secret = var.cloudinary_api_secret
    sendgrid_api_key      = var.sendgrid_api_key
    sendgrid_verified_sender = var.sendgrid_verified_sender
    admin_email           = var.admin_email
    github_repo_url       = var.github_repo_url
  })

  tags = {
    Name    = "latam-democrat-server"
    Project = "LATAM DEMOCRAT"
    Student = "Ricardo Andaluz (D00262961)"
    Region  = "eu-west-1"
  }
}

# Elastic IP (optional but recommended for consistent IP)
resource "aws_eip" "latam_democrat_eip" {
  instance = aws_instance.latam_democrat_server.id
  domain   = "vpc"

  tags = {
    Name    = "latam-democrat-eip"
    Project = "LATAM DEMOCRAT"
  }
}
