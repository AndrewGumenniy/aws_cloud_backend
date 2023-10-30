import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
import * as process from 'process';

import getProductsList from '@functions/get-product-list';
import getProductsById from '@functions/get-product-by-id';
import createProduct from '@functions/create-product';

dotenv.config();

const { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME, DEFAULT_REGION } = process.env;

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
      STOCKS_TABLE_NAME: STOCKS_TABLE_NAME
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
      }
    ]
  },
  functions: { getProductsList, getProductsById, createProduct },
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
  },
};

module.exports = serverlessConfiguration;
