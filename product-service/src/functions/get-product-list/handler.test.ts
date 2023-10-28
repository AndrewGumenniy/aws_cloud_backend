
import { getProductsList } from './handler';
import * as productsActions from '@utils/product-data-validation';
import { getProducts } from "@utils/product-data-validation";

describe('getProductsById', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('successful case', () => {
        it('should return product', async () => {
            const products = getProducts();
            const response = await getProductsList();
            expect(JSON.parse(response.body)).toEqual(products);
        });

        it('should return status 200', async () => {
            const response = await getProductsList();
            expect(response.statusCode).toEqual(200);
        });
    });

    describe('error case', () => {
        it('should return status 500', async () => {
            jest.spyOn(productsActions, 'getProducts').mockImplementationOnce(() => { throw new Error('Error') });
            const response = await getProductsList();
            expect(response.statusCode).toEqual(500);
        });
    });
});