import { Product } from "src/database"

export function validateProductBody(
  body: Partial<Product>
): body is Omit<Product, "id"> {
  return (
    typeof body.title === "string" &&
    typeof body.description === "string" &&
    typeof body.price === "number" &&
    body.price > 0 &&
    typeof body.count === "number" &&
    body.count >= 0
  )
}
