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
        authorizer: {
          name: '${self:custom.authorizers.basicAuthorizer.name}',
          arn: '${self:custom.authorizers.basicAuthorizer.arn}',
          type: '${self:custom.authorizers.basicAuthorizer.type}',
          resultTtlInSeconds: 0
        },
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
