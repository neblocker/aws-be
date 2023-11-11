import { DynamoDB } from "aws-sdk"
import { PRODUCTS } from "src/database"
import { normalizeProductParams, normalizeStockParams } from "../../utils"

const dynamoDb = new DynamoDB({ region: "eu-west-1" })

export const initDb = (): void => {
  const params = {
    RequestItems: {
      [process.env.PRODUCT_TABLE]: PRODUCTS.map(normalizeProductParams),
      [process.env.STOCK_TABLE]: PRODUCTS.map(normalizeStockParams)
    }
  }

  dynamoDb.batchWriteItem(params, (error, data) => {
    if (error) {
      console.log("error", error)
    } else {
      console.log("data succcess", data)
    }
  })
}
