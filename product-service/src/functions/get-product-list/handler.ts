import { APIGatewayProxyResult } from 'aws-lambda';

import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { StatuseCodeList } from '@constatns/http-response';
import { getProductList } from 'src/services/product-management';
import { addErrorToLog } from '@utils/log-utils';

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
    try {
        const products = await getProductList();

        return formatJSONResponse(products, StatuseCodeList.Success);
    } catch (err) {
        addErrorToLog(`getProductsList() error: ${err.message}`);
        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
}

export const main = middyfy(getProductsList);