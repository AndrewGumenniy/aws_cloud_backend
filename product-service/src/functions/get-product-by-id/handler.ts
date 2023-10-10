import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { getProductsByIdHandler } from '@utils/products';
import { PRODUCTS_NOT_FOUND_ERROR_MESSAGE, StatuseCodeList } from '@constatns/http-response';


export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try{
        const { id } = event.pathParameters;
        const product = await getProductsByIdHandler(id);

        if (!product) {
            return formatJSONResponse({ message: PRODUCTS_NOT_FOUND_ERROR_MESSAGE({ id }) }, StatuseCodeList.NotFound);
        }

        return formatJSONResponse(product, StatuseCodeList.Success);
    } catch (err) {
        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
};

export const main = middyfy(getProductsById);
