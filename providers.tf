terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }

}

provider "aws" {
  # This should match the profile name in the credentials file described below
  # profile = "terraform"
  # Choose the region where you want the S3 bucket to be hosted
  region = var.aws_region
}
