import { APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { StatuseCodeList } from '@constatns/http-response';
import { getProducts } from '@utils/products';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await getProducts();

        return formatJSONResponse(products, StatuseCodeList.Success);
    } catch (err) {
        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
}

export const main = middyfy(getProductsList);