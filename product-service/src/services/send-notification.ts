import { PublishCommand, PublishInput, SNSClient } from '@aws-sdk/client-sns';
import process from 'process';
import * as dotenv from 'dotenv';

import { JoinedProductData } from '@interfaces/product';
import { SNS_SUCCESS_MESSAGE, SNS_SUCCESS_SUBJECT } from '@constatns/queue';

dotenv.config();

const snsClient = new SNSClient({ region: process.env.REGION });

export const sendNotifications = async (product: JoinedProductData) => {
  const publishCommandInput: PublishInput = {
    Subject: SNS_SUCCESS_SUBJECT,
    Message: SNS_SUCCESS_MESSAGE({title: product.title}),
    TopicArn: process.env.SNS_ARN
  };
  const publishCommand = new PublishCommand(publishCommandInput);

  await snsClient.send(publishCommand);
};