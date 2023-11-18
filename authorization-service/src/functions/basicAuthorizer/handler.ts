import { APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

import { PolicyEffect } from 'src/interfaces/authorisation';
import { generatePolicy, parseToken } from 'src/utils/authorizer';

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event) => {
  console.log('basicAuthorizer event:', event);

  const { authorizationToken, methodArn } = event;
  const { LOGIN, TEST_PASSWORD } = process.env;

  try {
    const tokenCredentials = authorizationToken.split(' ')[1];
    const decodedToken = parseToken(tokenCredentials);
    const isAuthorised = LOGIN === decodedToken.login && TEST_PASSWORD === decodedToken.password;

    return isAuthorised
      ? generatePolicy(tokenCredentials, PolicyEffect.Allow, methodArn)
      : generatePolicy(tokenCredentials, PolicyEffect.Deny, methodArn);
  } catch (error) {
    return generatePolicy('Unauthorized', PolicyEffect.Deny, methodArn);
  }
};

export const main = basicAuthorizer;


