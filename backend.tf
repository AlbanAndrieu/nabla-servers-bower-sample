terraform {
  #backend "local" {}
  /*
  backend "consul" {
     address = "10.30.0.66:8500"
     path    = "uat/terraform.tfstate"
     scheme  = "http"
     lock    = true
     gzip    = false
  }
  */
  #backend "consul" {}
  /*
  backend "s3" {
    bucket = "nabla-terraform"
    // key    = "bower/uat.tfstate"
    region = "eu-west-3"
  }
  backend "swift" {
    container         = "build-tfstates"
    archive_container = "build-tfstates-archive"
    state_name        = "bower-uat.tfstate"
    region_name       = "GRA"
  }
  backend "remote" {
    hostname = "app.terraform.io"
    # The name of your Terraform Cloud organization.
    organization = "nabla"

    # The name of the Terraform Cloud workspace to store Terraform state files in.
    workspaces {
      #name = "nabla"
      prefix = "bower-"
    }
  }
  */
  #backend "http" {}
  # https://www.terraform.io/language/settings/backends/http
  # https://docs.gitlab.com/ee/user/infrastructure/iac/terraform_state.html#get-started-using-local-development
  #backend "remote" {}

  backend "remote" {
    hostname = "app.terraform.io"
    # The name of your Terraform Cloud organization.
    organization = "nabla"

    # The name of the Terraform Cloud workspace to store Terraform state files in.
    workspaces {
      name = "nabla"
      #prefix = "bower-"
    }
  }
}
