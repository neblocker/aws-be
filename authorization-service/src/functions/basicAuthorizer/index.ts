import { handlerPath } from "@libs/handler-resolver"

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  url: {
    cors: true
  }
}