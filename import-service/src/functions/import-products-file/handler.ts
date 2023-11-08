import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { APIGatewayEvent } from "aws-lambda"

const importProductsFile = async (event: APIGatewayEvent) => {
  try {
    const s3Client = new S3Client({ region: "eu-west-1" })
    const name = event.queryStringParameters?.name
    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "File name is required" })
      }
    }
    const key = `uploaded/${name}`
    const bucketName = "import-service-bucket-1"

    if (!bucketName) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Server error: S3 bucket not configured."
        })
      }
    }

    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: "text/csv"
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl })
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" })
    }
  }
}

export const main = importProductsFile
