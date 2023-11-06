export const SQS_QUEUE_NAME = 'catalogItemsQueue';
export const SNS_TOPIC_NAME = 'createProductTopic'
export const SNS_SUCCESS_MESSAGE = ({ title }): string => `Product with title ${title} was created`;
export const SNS_SUCCESS_SUBJECT = '[Product successfully created]';
