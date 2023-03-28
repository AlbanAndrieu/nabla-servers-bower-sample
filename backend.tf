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
    region = var.aws_region

    dynamodb_table = "jusmundi-terraform-locks"
    encrypt        = true
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
      name = "nabla"
      #prefix = "bower-"
    }
  }
  */

  #backend "http" {}
  # https://www.terraform.io/language/settings/backends/http
  # https://docs.gitlab.com/ee/user/infrastructure/iac/terraform_state.html#get-started-using-local-development
  cloud {
    organization = "nabla"

    workspaces {
      name = "nabla"
    }
  }

}

# See https://blog.gruntwork.io/how-to-manage-terraform-state-28f5697e68fa
resource "aws_s3_bucket" "terraform_state" {
  bucket = "nabla-terraform"
  # Enable versioning so we can see the full revision history of our
  # state files
  versioning {
    enabled    = true
    mfa_delete = true
  }
  # Enable server-side encryption by default
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "nabla-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
