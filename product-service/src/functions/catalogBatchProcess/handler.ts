import { APIGatewayProxyResult } from "aws-lambda"
import { middyfy } from "@libs/lambda"
import { validateProductBody } from "src/utils/validateProductData"
import { createSingleProduct } from "src/services/createProduct"
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"

export const handler = async (event): Promise<APIGatewayProxyResult> => {
  const productsList = event.Records.map((record) => JSON.parse(record.body))

  const createdProducts = productsList.map((product) => {
    try {
      validateProduct(product)
      createSingleProduct(product)
    } catch (error) {
      console.log("error", error)
    }
  })

  await Promise.all(createdProducts)

  const snsClient = new SNSClient({ region: "eu-west-1" })
  snsClient.send(
    new PublishCommand({
      TargetArn:
        "arn:aws:sns:eu-west-1:023721665280:product-service-dev-createProductTopic-Bl1GI9GtuozC",
      Subject: "Product created",
      Message: "Your products are created successfully"
    })
  )

  return {
    statusCode: 200,
    body: JSON.stringify("created")
  }
}

function validateProduct(product) {
  if (!validateProductBody(product)) {
    throw new Error("Product data is invalid")
  }
}

export const proceedCatalogBatch = middyfy(handler)
