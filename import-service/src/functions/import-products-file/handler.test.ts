import {importProductsFile} from "./handler";
import {APIGatewayProxyEvent} from "aws-lambda";
import * as process from "process";
import { NO_FILE_NAME } from "src/constants/http-response";

describe('importProductsFile', () => {
    let event: APIGatewayProxyEvent;

    beforeEach(() => {
        event = {
            requestContext: {
                path: 'some_path',
                httpMethod: "GET",
                accountId: "some_account_id"
            },
            pathParameters: {},
            queryStringParameters: {
                name: 'test_file.csv',
            },
            body: {},
            ...{} as APIGatewayProxyEvent
        };

        process.env.BUCKET = 'test_bucket_name';
        process.env.REGION = 'eu-west-1';
    });

    describe('successful case', () => {
        it('should return Signed Url', async () => {
            const response = await importProductsFile(event);
            expect(response.body).toMatch(
                /https:\/\/s3.eu-west-1.amazonaws.com\/test_bucket_name\/uploaded\/test_file.csv.*?X-Amz-Credential=.*?Amz-Expires=60.*?id=PutObject/
            );
        });

        it('should return status 200', async () => {
            const response = await importProductsFile(event);
            expect(response.statusCode).toEqual(200);
        });
    });

    describe('error cases', () => {
        describe('Bad Request 400 in case if request query parameter "name" is not specified', () => {
            beforeEach(() => {
                event = {
                    ...event,
                    queryStringParameters: {}
                }
            });

            it('should return Bad Request: No file name specified', async () => {
                const response = await importProductsFile(event);
                expect(JSON.parse(response.body)).toEqual({ message: NO_FILE_NAME });
            });

            it('should return status 400', async () => {
                const response = await importProductsFile(event);
                expect(response.statusCode).toEqual(400);
            });
        });
        describe('Internal Server Error 500 - environment variable BUCKET is not specified', () => {
            beforeEach(() => {
                delete process.env.BUCKET;
            });

            it('should return status 500', async () => {
                const response = await importProductsFile(event);
                expect(response.statusCode).toEqual(500);
            });
        });
    });
});