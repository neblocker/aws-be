import { middyfy } from "@libs/lambda"

const handler = async (event) => {
  const eventToken = event.authorizationToken

  if (event.type !== "REQUEST") {
    return "Unauthorized. Header credentials are missed!"
  }

  try {
    const encodedToken = eventToken.split("Basic")[1].trim()
    const decodedToken = Buffer.from(encodedToken, "base64")
    const [username, password] = decodedToken.toString("utf-8").split(":")
    const effect =
      !process.env[username] || process.env[username] !== password
        ? "Deny"
        : "Allow"
    return generatePolicy(encodedToken, event.methodArn, effect)
  } catch (error) {
    return `Access Denied - ${error.message}`
  }
}

function generatePolicy(principleId: string, resource, effect = "Allow") {
  return {
    principleId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "exucute-api:Invoke",
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const main = middyfy(handler)
