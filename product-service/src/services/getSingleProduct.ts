import { DynamoDB } from "aws-sdk"

const dynamoDb = new DynamoDB.DocumentClient()

export async function getSingleProduct(productId: string) {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: productId
    }
  }
  const stockParams = {
    TableName: process.env.STOCK_TABLE,
    Key: {
      product_id: productId
    }
  }

  const { Item: productData } = await dynamoDb.get(params).promise()
  const { Item: countData } = await dynamoDb.get(stockParams).promise()

  return {
    ...productData,
    count: countData.count
  }
}
