import { APIGatewayProxyEvent } from "aws-lambda";

import { PRODUCTS_NOT_FOUND_ERROR_MESSAGE } from '@constatns/http-response';
import { getProductsById } from './handler';
import * as productsActions from '@utils/product-data-validation';

describe('getProductsById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('successful case', () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
            },
            ...{} as APIGatewayProxyEvent
        };

        const mockProductServiceData =
          {
            "count": 4,
            "description": "This book is an exciting journey where novice developers learn everything they need to do before they start working on the Angular framework and develop dynamic web applications.",
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
            "price": 20.41,
            "title": "A Journey to Angular Development",
            "img": "https://m.media-amazon.com/images/I/51QMjI34jLS._SY466_.jpg"
          };

        it('should return product', async () => {
            const response = await getProductsById(event);
            expect(JSON.parse(response.body)).toEqual(mockProductServiceData);
        });

        it('should return status 200', async () => {
            const response = await getProductsById(event);
            expect(response.statusCode).toEqual(200);
        });
    });

    describe('product not found case', () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                id: '11111'
            },
            ...{} as APIGatewayProxyEvent
        };

        it('should return Product not found', async () => {
            const response = await getProductsById(event);
            expect(JSON.parse(response.body)).toEqual({message: PRODUCTS_NOT_FOUND_ERROR_MESSAGE({ id: event.pathParameters.id })});
        });

        it('should return status 404', async () => {
            const response = await getProductsById(event);
            expect(response.statusCode).toEqual(404);
        });
    });

    describe('error case', () => {
        const event: APIGatewayProxyEvent = {
            pathParameters: {
                id: '11111'
            },
            ...{} as APIGatewayProxyEvent
        };

        it('should return status 500', async () => {
            jest.spyOn(productsActions, 'getProducts').mockImplementationOnce(() => { throw new Error('Error') });
            const response = await getProductsById(event);
            expect(response.statusCode).toEqual(500);
        });
    });
});