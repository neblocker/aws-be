import { handlerPath } from "@libs/handler-resolver"

export default {
  handler: `${handlerPath(__dirname)}/handler.getProducts`,
  events: [
    {
      http: {
        method: "get",
        path: "products",
        cors: true
      }
    }
  ]
}
