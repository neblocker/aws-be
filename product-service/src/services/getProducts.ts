import { AttributeValue, DynamoDB } from "@aws-sdk/client-dynamodb"
import { unmarshall } from "@aws-sdk/util-dynamodb"

const dynamoDb = new DynamoDB({ region: "eu-west-1" })

export async function getProductsList() {
  const productsData = await dynamoDb.scan({
    TableName: process.env.PRODUCT_TABLE
  })
  const productsItems = productsData.Items

  const stocksData = await dynamoDb.scan({ TableName: process.env.STOCK_TABLE })
  const stocksItems = stocksData.Items

  const stocksIds = new Map<string, AttributeValue>()

  stocksItems.forEach((stock) => stocksIds.set(stock.product_id.S, stock.count))

  return productsItems.map((product) =>
    unmarshall({
      ...product,
      count: stocksIds.get(product.id.S)
    })
  )
}
