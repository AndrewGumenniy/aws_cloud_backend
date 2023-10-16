import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

import { EMPTY_BODY, PRODUCT_DATA_IS_INVALID, StatuseCodeList } from '@constatns/http-response';
import { JoinedProductData } from '@interfaces/product';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { validateProductStructure } from '@utils/product-data-validation';
import { createNewProduct } from 'src/services/product-management';
import { addErrorToLog, addRequestToLog } from '@utils/log-utils';

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const product: JoinedProductData = JSON.parse(JSON.stringify(event.body));

        addRequestToLog(event);

        if (!Object.keys(product).length) {
            addErrorToLog(`createProduct() error: ${EMPTY_BODY}`);

            return formatJSONResponse({ message: EMPTY_BODY}, StatuseCodeList.BadRequest);
        }

        if (!validateProductStructure(product)) {
            addErrorToLog(`createProduct() error: ${PRODUCT_DATA_IS_INVALID}`);

            return formatJSONResponse({ message: PRODUCT_DATA_IS_INVALID}, StatuseCodeList.BadRequest);
        }

        const createProductResult = await createNewProduct(product);

        return formatJSONResponse(createProductResult, StatuseCodeList.Success);
    } catch (err) {
        addErrorToLog(`createProduct() error: ${err.message}`);

        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
};

export const main = middyfy(createProduct);
