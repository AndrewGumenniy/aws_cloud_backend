import { handlerPath } from '@libs/handler-resolver';
import { GET_METHOD, GET_PRODUCTS_URL } from '@constatns/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: GET_METHOD,
        path: GET_PRODUCTS_URL,
        cors: true,
        responseData: {
          200: {
            description: 'Product list',
            bodyType: 'ProductList'
          }
        }
      }
    }
  ]
};
