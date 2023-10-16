import { defaultHeaders } from "@constatns/http-request"
import { HttpResponseError } from "@interfaces/http-response-error"
import { Product, ProductList } from "@interfaces/product"

export const formatJSONResponse = (
  body: ProductList | Product | HttpResponseError | string | any,
  statusCode: number
) => {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body)
  }
}
