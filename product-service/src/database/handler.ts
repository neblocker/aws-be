import { PRODUCTS, Product } from "."

export const getProductList = async (): Promise<Product[]> => PRODUCTS

export const getProductDetails = async (id: string): Promise<Product> => {
  return PRODUCTS.find((product: Product) => product.id === id)
}
