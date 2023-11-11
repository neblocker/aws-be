import { DynamoDB, TransactWriteItemsInput } from "@aws-sdk/client-dynamodb"
import { Product } from "src/database"
import { v4 as uuidv4 } from "uuid"

const dynamoDb = new DynamoDB({ region: "eu-west-1" })

export async function createSingleProduct(
  body: Omit<Product, "id">
): Promise<void> {
  if (!process.env.PRODUCT_TABLE || !process.env.STOCK_TABLE) {
    throw new Error("env variables not defined")
  }

  const productId = uuidv4()
  const productParams = {
    Put: {
      TableName: process.env.PRODUCT_TABLE!,
      Item: {
        id: { S: productId },
        title: { S: body.title },
        description: { S: body.description },
        price: { N: body.price.toString() }
      }
    }
  }

  const stockParams = {
    Put: {
      TableName: process.env.STOCK_TABLE!,
      Item: {
        product_id: { S: productId },
        count: { N: body.count.toString() }
      }
    }
  }

  const params: TransactWriteItemsInput = {
    TransactItems: [productParams, stockParams]
  }

  await dynamoDb.transactWriteItems(params, (error, data) => {
    if (error) {
      console.log(error)
      throw new Error(error.message)
    } else {
      console.log(data)
    }
  })
}
