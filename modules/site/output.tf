
#output "instance_public_ip" {
#  value = aws_instance.site.public_ip
#}

output "app_bucket" {
  value = aws_s3_bucket.site.bucket
}

# To print the bucket's website URL after creation
output "website_endpoint" {
  value = aws_s3_bucket.site.website_endpoint
}

#output "dns_name" {
#  value = aws_elb.this.dns_name
#}
