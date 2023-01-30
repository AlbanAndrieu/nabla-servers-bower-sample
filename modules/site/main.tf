
resource "aws_s3_bucket" "site" {
  bucket = var.website_bucket_name
  tags = {
    Name        = "${var.site}"
    Environment = "production"
    Github      = "nabla-servers-bower-sample"
    Terraform   = "true"
  }
}

resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }

}

resource "aws_s3_bucket_acl" "site" {
  bucket = aws_s3_bucket.site.id

  acl = "private"
  # acl = "public-read"
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.website_bucket_name}/*"
    }
  ]
}
EOF

}

# in main.tf, below the aforementioned boilerplate
#resource "aws_s3_bucket_object" "file" {
#  for_each = fileset(var.website_root, "**")
#
#  bucket      = aws_s3_bucket.site.id
#  key         = each.key
#  source      = "${var.website_root}/${each.key}"
#  source_hash = filemd5("${var.website_root}/${each.key}")
#  acl         = "public-read"
#}
