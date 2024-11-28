provider "aws" {
  region = "us-west-2"
}

resource "aws_s3_bucket" "voxelspace_bucket" {
  bucket = "voxelspace-bucket"
  acl    = "private"
}

resource "aws_dynamodb_table" "voxelspace_table" {
  name           = "voxelspace-table"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_lambda_function" "voxelspace_lambda" {
  function_name = "voxelspace-lambda"
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  role          = aws_iam_role.voxelspace_lambda_role.arn
  filename      = "lambda_function_payload.zip"
}

resource "aws_iam_role" "voxelspace_lambda_role" {
  name = "voxelspace-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "voxelspace_lambda_policy" {
  role       = aws_iam_role.voxelspace_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
