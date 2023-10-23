import { defaultHeaders } from "src/constants/http-request"
import { HttpResponseError } from "src/interfaces/http-response-error"

export const formatJSONResponse = (
  body: HttpResponseError | string,
  statusCode: number
) => {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify(body)
  }
}
