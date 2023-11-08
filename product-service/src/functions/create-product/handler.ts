import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { createSingleProduct } from "src/services/createProduct"
import { validateProductBody } from "src/utils/validateProductData"

export const createProduct = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body)

    console.log("Request body:", requestBody)

    if (!validateProductBody(requestBody)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid product data provided." })
      }
    }

    await createSingleProduct(requestBody)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Product is created successfully" })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "[Internal Server Error.] Could not create product"
      })
    }
  }
}
