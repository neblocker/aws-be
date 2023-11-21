import { handlerPath } from "@libs/handler-resolver"

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        cors: true,
        authorizer: {
          type: "request",
          name: "basicAuthorizer",
          arn: "arn:aws:lambda:eu-west-1:023721665280:function:authorization-service-dev-basicAuthorizer"
        }
      }
    }
  ]
}
