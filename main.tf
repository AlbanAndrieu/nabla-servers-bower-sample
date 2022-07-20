terraform {

  required_version = "1.2.5"
}

resource "aws_default_vpc" "default" {}

resource "aws_security_group" "prod_web" {
  description = "Allow standard htpp and https ports"
  name        = "prod-web"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.whitelist
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.whitelist
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    "Terraform" : "true"
  }
}

module "site" {
  source = "./modules/site"

  aws_region          = var.aws_region
  github_organization = var.github_organization
  website_bucket_name = var.website_bucket_name
  website_root        = var.website_root
  #subnets             = [aws_default_subnet.default_az1.id,aws_default_subnet.default_az2.id]
  #security_groups     = [aws_security_grpip.prod_web.id]
  site = "prod"
}
