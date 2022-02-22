
variable "aws_region" {
  description = "AWS region to launch servers."
  default     = "eu-central-1"
}

# Ubuntu Precise 12.04 LTS (x64)
#variable "aws_amis" {
#  default = {
#    eu-west-1 = "ami-674cbc1e"
#    us-east-1 = "ami-1d4e7a66"
#    us-west-1 = "ami-969ab1f6"
#    us-west-2 = "ami-8803e0f0"
#  }
#}

variable "github_organization" {
  description = "Github organization"
  default     = "Nabla"
}

#variable "github_token" {
#  description = "Github user token"
#}
variable "website_bucket_name" {
  description = "Nabla bower site"
  default     = "nabla-tf-exemple-bucket"
}
# To avoid repeatedly specifying the path, we'll declare it as a variable
variable "website_root" {
  type        = string
  description = "Path to the root of website content"
  default     = "./dist"
}