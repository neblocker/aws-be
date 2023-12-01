const handler = async (event) => {
  const eventToken = event.authorizationToken

  if (event.type !== "TOKEN") {
    return generatePolicy("unknown", event.methodArn, "Deny")
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
    return generatePolicy("unknown", event.methodArn, "Deny")
  }
}

function generatePolicy(principalId: string, resource, effect = "Allow") {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}

export const main = handler
