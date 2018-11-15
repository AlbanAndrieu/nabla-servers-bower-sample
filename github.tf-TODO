# Configure the GitHub Provider
provider "github" {
  token        = "${var.github_token}"
  organization = "${var.github_organization}"
}

resource "github_repository" "nabla-servers-bower-sample" {
  name        = "nabla-servers-bower-sample"
  description = "A sample project using nabla-servers-bower components"

  private = false
}
