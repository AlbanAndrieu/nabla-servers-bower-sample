
variable "CI_PROJECT_NAME" {
  type    = string
  default = "default"
}

variable "aws_region" {
  description = "AWS region to launch servers."
  type        = string
  default     = "eu-central-1"
}

variable "whitelist" {
  type = list(string)
}

variable "github_organization" {
  description = "Github organization"
  type        = string
  default     = "Banbou"
}

variable "website_bucket_name" {
  description = "Nabla bower site"
  type        = string
  default     = "nabla-tf-site-bucket"
}

# To avoid repeatedly specifying the path, we'll declare it as a variable
variable "website_root" {
  description = "Path to the root of website content"
  type        = string
  default     = "./dist"
}

variable "site" {
  description = "Site Name"
  type        = string
}
