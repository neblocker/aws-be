import { handlerPath } from "@libs/handler-resolver"

export default {
  handler: `${handlerPath(__dirname)}/handler.proceedCatalogBatch`,
  events: [
    {
      sqs: {
        arn: {
          "Fn::GetAtt": ["CatalogItemsQueue", "Arn"]
        },
        batchSize: 5
      }
    }
  ]
}
