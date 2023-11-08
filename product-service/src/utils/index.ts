export const normalizeProductParams = (product) => {
  const { id, title, description, price } = product

  return {
    PutRequest: {
      Item: {
        id: { S: id },
        title: { S: title },
        description: { S: description },
        price: { N: price.toPrecision(2) }
      }
    }
  }
}

export const normalizeStockParams = (product) => {
  const { id, count } = product

  return {
    PutRequest: {
      Item: {
        product_id: { S: id },
        count: { N: count.toString() }
      }
    }
  }
}
