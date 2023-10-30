import { DynamoDBClient, QueryCommand, ScanCommand, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { uuid } from "uuidv4";
import * as dotenv from 'dotenv';
import * as process from 'process';

import { JoinedProductData } from "@interfaces/product";

dotenv.config();

const { DB_REGION, PRODUCTS_TABLE_NAME, STOCKS_TABLE_NAME } = process.env;
const client = new DynamoDBClient({ region: DB_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getProductList = async () => {
    const command = new ScanCommand({
        TableName: PRODUCTS_TABLE_NAME
    });
    const products = (await ddbDocClient.send(command))?.Items;

    return Promise.all(products.map((product) => convertToAvailableProduct(product)));
}

export const getProductById = async (id) => {
    const command = new QueryCommand({
        TableName: PRODUCTS_TABLE_NAME,
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {':id': {"S": id}}
    });
    const product = (await ddbDocClient.send(command))?.Items[0];

    if (!product) {
        return null
    }

    return convertToAvailableProduct(product)
}

export const getStockByProductId = async (productId) => {
    const command = new QueryCommand({
        TableName: 'Stocks',
        KeyConditionExpression: 'product_id = :productId',
        ExpressionAttributeValues: {':productId': productId}
    })
    const stocks = (await ddbDocClient.send(command))?.Items;

    return (stocks[0] || null)
}

export const convertToAvailableProduct = async (product) => {
    const stock = await getStockByProductId(product.id)

    const availableProduct = {
        ...product,
        count: stock?.count || 0
    }

    return unmarshall(availableProduct);
}

export const createNewProduct = async (data: JoinedProductData) => {
    const {title, description, price, count, img } = data;
    const product = {id: uuid(), title, description, price, img};
    const stock = {product_id: product.id, count: count};
    const command = new TransactWriteItemsCommand(
        {
            TransactItems: [
                {
                    Put: {
                        Item: marshall(product),
                        TableName: PRODUCTS_TABLE_NAME
                    }
                },
                {
                    Put: {
                        Item: marshall(stock),
                        TableName: STOCKS_TABLE_NAME
                    }
                }
            ]
        }
    );

    await ddbDocClient.send(command);

    return getProductById(product.id)
}