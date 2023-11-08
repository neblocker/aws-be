import { DynamoDB } from "aws-sdk"

const dynamoDb = new DynamoDB.DocumentClient()

export async function getProductsList() {
  const productsData = await dynamoDb
    .scan({ TableName: process.env.PRODUCT_TABLE })
    .promise()
  const productsItems = productsData.Items

  const stocksData = await dynamoDb
    .scan({ TableName: process.env.STOCK_TABLE })
    .promise()
  const stocksItems = stocksData.Items

  const stocksIds = new Map<string, { product_id: string; count: number }>()
  stocksItems.forEach((stock) => stocksIds.set(stock.product_id, stock.count))

  return productsItems.map((product) => ({
    ...product,
    count: stocksIds.get(product.id)
  }))
}
