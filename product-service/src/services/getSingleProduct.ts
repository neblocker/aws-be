import { DynamoDB } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const dynamoDb = new DynamoDB({ region: "eu-west-1" })

export async function getSingleProduct(productId: string) {
  const params = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: {
        S: productId
      }
    }
  }
  const stockParams = {
    TableName: process.env.STOCK_TABLE,
    Key: {
      product_id: {
        S: productId
      }
    }
  }

  const { Item: productData } = await dynamoDb.getItem(params)
  const { Item: countData } = await dynamoDb.getItem(stockParams)

  return unmarshall({ ...productData, count: countData.count })
}
