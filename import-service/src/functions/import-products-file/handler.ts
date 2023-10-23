
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { NO_FILE_NAME, StatuseCodeList } from 'src/constants/http-response';
import { getSignedUrlHandler } from 'src/utils/get-sighned-url';

export const importProductsFile = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("import products file event", event);

  const name = event.queryStringParameters.name;

  if (!name) {
    return formatJSONResponse({ message: NO_FILE_NAME }, StatuseCodeList.BadRequest);
  }

  try {
    const signedUrl = await getSignedUrlHandler(name);

    return formatJSONResponse(signedUrl, StatuseCodeList.Success);
  } catch (error) {
    return formatJSONResponse({ message: error }, StatuseCodeList.ServerError);
  }
};

export const main = middyfy(importProductsFile);