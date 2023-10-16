import {APIGatewayProxyEvent} from 'aws-lambda';

export const addRequestToLog = ({
                                    requestContext: { path, httpMethod, accountId },
                                    pathParameters,
                                    body
                                }: APIGatewayProxyEvent) =>
{
    console.log(
        {
            requestPath: path,
            method: httpMethod,
            accountId,
            pathParameters,
            body
        }
    );
};

export const addErrorToLog = (errorText) => {
    console.log(errorText);
}
