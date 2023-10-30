import {SQSEvent, SQSRecord} from 'aws-lambda';

import { catalogBatchProcess } from './handler';
import * as productManagementService from 'src/services/product-management';
import * as sendNotificationService from 'src/services/send-notification';

describe('catalogBatchProcess', () => {
    const product = {
        title: 'test product',
        description: 'test product description',
        price: 11.2,
        img: 'https://test_product.jpg',
        count: 22
    };

    const event: SQSEvent = {
        Records: [
            {
                body: JSON.stringify(product),
                ...{} as SQSRecord
            }
        ]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('successful cases', () => {
        it('should create product', async () => {
            const spy = jest.spyOn(productManagementService, 'createNewProduct');
            await catalogBatchProcess(event, null, null);

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining(
                    JSON.parse(event.Records[0].body)
                ));
        });

        it('should send notification in case if no error occurred', async () => {
            const spy = jest.spyOn(sendNotificationService, 'sendNotifications');
            await catalogBatchProcess(event, null, null);

            expect(spy).toHaveBeenCalledWith(expect.objectContaining(
                JSON.parse(event.Records[0].body)
            ));
        });
    });

    describe('failure cases', () => {
        it('should not create product in case if input data is invalid', async () => {
            const spy = jest.spyOn(productManagementService, 'createNewProduct');
            event.Records[0].body = '';

            await catalogBatchProcess(event, null, null);

            expect(spy).not.toHaveBeenCalled();
        });


        it('should not create product in case if input product structure is invalid', async () => {
            const spy = jest.spyOn(productManagementService, 'createNewProduct');
            event.Records[0].body = JSON.stringify({ title: 'test product' });

            await catalogBatchProcess(event, null, null);

            expect(spy).not.toHaveBeenCalled();
        });

        it('should not send success notification in case if product was not created', async () => {
            const spy = jest.spyOn(sendNotificationService, 'sendNotifications')
            event.Records[0].body = JSON.stringify({ title: 'test product' });

            await catalogBatchProcess(event, null, null);

            expect(spy).not.toHaveBeenCalled();
        });
    });
});