# AWS Configuration Variables for LATAM DEMOCRAT

variable "aws_region" {
  description = "AWS region for deployment (eu-west-1 for Ireland)"
  type        = string
  default     = "eu-west-1"
}

variable "aws_profile" {
  description = "AWS CLI profile name"
  type        = string
  default     = "default"
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key file (ace-key.pub)"
  type        = string
  default     = "C:\\Users\\ricar\\Downloads\\ace-key.pub"
}

variable "github_repo_url" {
  description = "GitHub repository URL for LATAM DEMOCRAT app"
  type        = string
}

# Database
variable "mongodb_uri" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

# Cloudinary
variable "cloudinary_cloud_name" {
  description = "Cloudinary cloud name"
  type        = string
  sensitive   = true
}

variable "cloudinary_api_key" {
  description = "Cloudinary API key"
  type        = string
  sensitive   = true
}

variable "cloudinary_api_secret" {
  description = "Cloudinary API secret"
  type        = string
  sensitive   = true
}

# SendGrid (deprecated but kept for compatibility)
variable "sendgrid_api_key" {
  description = "SendGrid API key"
  type        = string
  sensitive   = true
}

variable "sendgrid_verified_sender" {
  description = "SendGrid verified sender email"
  type        = string
  sensitive   = true
}

# Admin
variable "admin_email" {
  description = "Admin email for contact form submissions"
  type        = string
}
