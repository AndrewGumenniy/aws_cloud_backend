import { handlerPath } from '@libs/handler-resolver';
import { POST_METHOD, PRODUCTS_URL } from '@constatns/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: POST_METHOD,
        path: PRODUCTS_URL,
        cors: true,
        responseData: {
          200: {
            description: 'Created product',
            bodyType: 'JoinedProductData'
          },
          400: {
            description: 'Product data is invalid'
          },
          500: {
            description: 'Server Error'
          }
        }
      }
    }
  ]
};
