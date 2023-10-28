import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PRODUCTS_NOT_FOUND_ERROR_MESSAGE, StatuseCodeList } from '@constatns/http-response';
import { getProductById } from 'src/services/product-management';
import { addErrorToLog, addRequestToLog } from '@utils/log-utils';


export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        const { id } = event.pathParameters;
        const product = await getProductById(id);

        addRequestToLog(event);

        if (!product) {
            return formatJSONResponse({ message: PRODUCTS_NOT_FOUND_ERROR_MESSAGE({ id }) }, StatuseCodeList.NotFound);
        }

        return formatJSONResponse(product, StatuseCodeList.Success);
    } catch (err) {
        addErrorToLog(`getProductsById() error: ${err.message}`);
        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
};

export const main = middyfy(getProductsById);
