import { handlerPath } from '@libs/handler-resolver';
import { GET_METHOD, GET_PRODUCTS_BY_ID_URL } from '@constatns/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
          method: GET_METHOD,
          path: GET_PRODUCTS_BY_ID_URL,
          cors: true,
          responseData: {
            200: {
              description: 'Product object',
              bodyType: 'Product'
            },
            404: {
              description: 'Product not found'
            }
          }
      }
    }
  ]
};
