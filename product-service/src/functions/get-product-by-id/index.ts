import { handlerPath } from '@libs/handler-resolver';
import { GET_METHOD, PRODUCTS_BY_ID_URL } from '@constatns/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
          method: GET_METHOD,
          path: PRODUCTS_BY_ID_URL,
          cors: true,
          responseData: {
            200: {
              description: 'Product object',
              bodyType: 'JoinedProductData'
            },
            404: {
              description: 'Product not found'
            },
            500: {
              description: 'Server Error'
            }
          }
      }
    }
  ]
};
