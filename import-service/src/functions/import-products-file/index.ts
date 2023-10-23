import { handlerPath } from '@libs/handler-resolver';
import { GET_METHOD, IMPORT } from 'src/constants/http-request';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: GET_METHOD,
        path: IMPORT,
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        }
      }
    }
  ]
};
