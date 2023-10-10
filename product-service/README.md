# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

npm run deploy - delpoy project to AWS  
npm run local - deploy for local development  
npm run test - run test suite  
npm run swagger - build local swagger documentation  

## AWS endpoints

GetProducts - https://jjiuus8kjd.execute-api.eu-west-1.amazonaws.com/dev/products  
GetProductsById - https://jjiuus8kjd.execute-api.eu-west-1.amazonaws.com/dev/products/{id}  
Swagger - https://fon5cay0fg.execute-api.eu-west-1.amazonaws.com/swagger  

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file
- [@serverless/esbuild](https://www.serverless.com/plugins/serverless-esbuild) - Serverless plugin for zero-config JavaScript and TypeScript code bundling using promising fast & furious esbuild bundler and minifier
- [@serverless-auto-swagger](https://github.com/completecoding/serverless-auto-swagger) - This plugin allows you to automatically generate a swagger endpoint, describing your application endpoints. This is built from your existing serverless config and typescript definitions, reducing the duplication of work.
- [@serverless-offline](https://www.serverless.com/plugins/serverless-offline) - This Serverless plugin emulates AWS λ and API Gateway on your local machine to speed up your development cycles. To do so, it starts an HTTP server that handles the request's lifecycle like APIG does and invokes your handlers.
- [@jest](https://github.com/jestjs/jest) - A comprehensive JavaScript testing solution. Works out of the box for most JavaScript projects
