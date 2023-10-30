import {handlerPath} from "@libs/handler-resolver";
import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const { BUCKET } = process.env;

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/'
          }
        ],
        existing: true
      }
    }
  ]
}
