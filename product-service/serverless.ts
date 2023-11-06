import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import * as process from 'process';

import getProductsList from '@functions/get-product-list';
import getProductsById from '@functions/get-product-by-id';
import createProduct from '@functions/create-product';
import { SNS_TOPIC_NAME, SQS_QUEUE_NAME } from '@constatns/queue';
import catalogBatchProcess from '@functions/catalogBatchProcess';

dotenv.config();

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME, DEFAULT_REGION, SNS_SUBSCRIPTION_EMAIL, SNS_FILTER_POLICY_SUBSCRIPTION_EMAIL } = process.env;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-esbuild',
    'serverless-offline'
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: 'dev',
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DB_REGION: DEFAULT_REGION,
      PRODUCTS_TABLE_NAME: PRODUCTS_TABLE_NAME,
      STOCKS_TABLE_NAME: STOCKS_TABLE_NAME,
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: [
          'arn:aws:dynamodb:${self:provider.region}:*:table/*'
        ]
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'SNSTopic' }
      }
    ]
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: SQS_QUEUE_NAME
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: SNS_TOPIC_NAME
        }
      },
      SNSFilterPolicySubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: SNS_FILTER_POLICY_SUBSCRIPTION_EMAIL,
          Protocol: 'email',
          TopicArn: {
              Ref: 'SNSTopic'
          },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            'price': [{'numeric': ['>', 100]}]
          }
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: SNS_SUBSCRIPTION_EMAIL,
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      }
    }
  },
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
      concurrency: 10,
    },
    autoswagger: {
      typefiles: ['./src/interfaces/product.ts'],
      basePath: '/dev',
      host: '27cq5albyi.execute-api.eu-west-1.amazonaws.com'
    }
  }
};

module.exports = serverlessConfiguration;
