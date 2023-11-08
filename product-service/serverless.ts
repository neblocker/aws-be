import type { AWS } from "@serverless/typescript"

import getProducts from "@functions/product-list"
import getProductById from "@functions/product-details"
import createProduct from "@functions/create-product"
import initDb from "@functions/initialize-db"

const serverlessConfiguration: AWS = {
  service: "product-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      PRODUCT_TABLE: "Products",
      STOCK_TABLE: "Stock"
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:DeleteItem",
              "dynamodb:BatchWriteItem",
              "dynamodb:transactWriteItems"
            ],
            Resource: [
              "arn:aws:dynamodb:eu-west-1:023721665280:table/Products",
              "arn:aws:dynamodb:eu-west-1:023721665280:table/Stock"
            ]
          }
        ]
      }
    }
  },
  functions: { getProducts, getProductById, createProduct, initDb },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10
    }
  }
}

module.exports = serverlessConfiguration
