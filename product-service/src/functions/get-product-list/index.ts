import { handlerPath } from '@libs/handler-resolver';
import { GET_METHOD, PRODUCTS_URL } from '@constatns/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: GET_METHOD,
        path: PRODUCTS_URL,
        cors: true,
        responseData: {
          200: {
            description: 'Product list',
            bodyType: 'ProductList'
          },
          500: {
            description: 'Server Error'
          }
        }
      }
    }
  ]
};
