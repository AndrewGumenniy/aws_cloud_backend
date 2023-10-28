import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";

import productsList from '../mocks/products.json'
import { PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } from "@constatns/db-connection";
import { addErrorToLog } from "@utils/log-utils";
import { formatJSONResponse } from "@libs/api-gateway";
import { StatuseCodeList } from "@constatns/http-response";

(async () => {
    const client = new DynamoDBClient({ region: 'eu-west-1' });
    const ddbDocClient = DynamoDBDocumentClient.from(client);

    const products = productsList.map(({count, ...product}) => product)
    const stocks = productsList.map(({id, count}) => ({product_id: id, count}))

    const updateItem = async (item, tableName) => {
        const command = new PutCommand({
            TableName: tableName,
            Item: item
        })

        return ddbDocClient.send(command);
    };

    try {
        await Promise.all(products.map(item => updateItem(item, PRODUCTS_TABLE_NAME)));
        await Promise.all(stocks.map(item => updateItem(item, STOCKS_TABLE_NAME)));
    } catch (err) {
        addErrorToLog(`update tables: ${err.message}`);
        return formatJSONResponse({ message: err }, StatuseCodeList.ServerError);
    }
})();
