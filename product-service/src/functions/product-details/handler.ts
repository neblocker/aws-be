import { APIGatewayProxyResult } from "aws-lambda"
import { getSingleProduct } from "src/services/getSingleProduct"

export const getProductById = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const { productId } = event.pathParameters

    console.log("product id", productId)

    return {
      statusCode: 200,
      body: JSON.stringify(await getSingleProduct(productId))
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "[Internal Server Error.]" })
    }
  }
}
