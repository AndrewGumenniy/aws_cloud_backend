import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import * as process from 'process';

import importProductsFile from '@functions/import-products-file';
import importFileParser from '@functions/import-file-parser';

dotenv.config();

const { BUCKET, REGION } = process.env;

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: REGION,
      BUCKET: BUCKET,
      QUEUE_URL: 'https://sqs.${self:provider.region}.amazonaws.com/${aws:accountId}/catalogItemsQueue'
    },
     iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: [`arn:aws:s3:::${BUCKET}`]
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: [`arn:aws:s3:::${BUCKET}/*`]
      },
      {
        Effect: 'Allow',
        Action: 'sqs:SendMessage',
        Resource: ['arn:aws:sqs:${self:provider.region}:${aws:accountId}:catalogItemsQueue']
      }
    ]
  },
  resources: {
    Resources: {
      GatewayErrorResponse: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Request-Headers': "'Authorization'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          }
        }
      }
    }
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10
    },
    authorizers: {
      basicAuthorizer: {
        name: 'basicAuthorizer',
        arn: 'arn:aws:lambda:${aws:region}:${aws:accountId}:function:authorization-service-dev-basicAuthorizer',
        type: 'token'
      }
    }
  }
};

module.exports = serverlessConfiguration;
