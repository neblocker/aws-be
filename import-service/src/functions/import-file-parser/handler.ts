import { S3Event } from "aws-lambda"
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3"
import csv from "csv-parser"

const importFileParser = async (event: S3Event) => {
  if (event.Records.length === 0) {
    console.error("No records in event", event)
    return
  }

  const bucketName = event.Records[0].s3.bucket.name
  const objectKey = event.Records[0].s3.object.key

  try {
    const s3Client = new S3Client({ region: "eu-west-1" })
    const result = await s3Client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: objectKey })
    )

    if (result.Body === undefined) {
      console.error("Unable to read stream", event)
      return
    }

    const objectStream = result.Body as NodeJS.ReadableStream

    await handleStream(objectStream)

    await s3Client.send(
      new CopyObjectCommand({
        CopySource: `${bucketName}/${objectKey}`,
        Bucket: bucketName,
        Key: `parsed/${objectKey.split("/")[1]}`
      })
    )

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      })
    )
  } catch (err) {
    console.error("Failed", err)
  }
}

const handleStream = (stream: NodeJS.ReadableStream) => {
  return new Promise((resolve, reject) => {
    const dataArray: unknown[] = []
    stream
      .pipe(csv())
      .on("data", (data) => dataArray.push(data))
      .on("error", (err) => reject(err))
      .on("end", () => {
        resolve(dataArray)
      })
  })
}

export const main = importFileParser
