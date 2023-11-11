import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import { getSingleProduct } from "src/services/getSingleProduct"

export const getProductById = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { productId } = event.pathParameters
    const productDetails = await getSingleProduct(productId)

    console.log("product details", productDetails)

    return {
      statusCode: 200,
      body: JSON.stringify(productDetails)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "[Internal Server Error.]" })
    }
  }
}
