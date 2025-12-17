# Output values after deployment for LATAM DEMOCRAT

output "instance_id" {
  description = "EC2 Instance ID"
  value       = aws_instance.latam_democrat_server.id
}

output "instance_public_ip" {
  description = "Public IP address of EC2 instance"
  value       = aws_eip.latam_democrat_eip.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of EC2 instance"
  value       = aws_instance.latam_democrat_server.public_dns
}

output "website_url" {
  description = "URL to access LATAM DEMOCRAT website"
  value       = "http://${aws_eip.latam_democrat_eip.public_ip}"
}

output "ssh_connection_command" {
  description = "Command to SSH into the instance (Windows users: use PuTTY or WSL)"
  value       = "ssh -i C:\\Users\\ricar\\Downloads\\ace-key ec2-user@${aws_eip.latam_democrat_eip.public_ip}"
}

output "region" {
  description = "AWS region where resources are deployed"
  value       = var.aws_region
}
