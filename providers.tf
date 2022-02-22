terraform {
  required_version = "~> 1.1.6"

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

}

provider "aws" {
  profile = "terraform"
  region = "${var.aws_region}"
}
