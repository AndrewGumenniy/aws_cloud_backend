import middy from '@middy/core';
import {SQSEvent, SQSHandler} from 'aws-lambda';

import { validateProductStructure } from '@utils/product-data-validation';
import { addErrorToLog } from '@utils/log-utils';
import { createNewProduct } from 'src/services/product-management';
import { sendNotifications } from 'src/services/send-notification';
import { PRODUCT_HAS_INVALID_FIELDS } from '@constatns/http-response';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
	try {
		for (const record of event.Records) {
			const product = JSON.parse(record.body);

			if (!validateProductStructure(product)) {
				addErrorToLog(PRODUCT_HAS_INVALID_FIELDS({ title: product.title }));

				return;
			}

			const newProduct = await createNewProduct(product);

			if(newProduct) {await sendNotifications(product);}
		}
	} catch (error) {
		addErrorToLog(`error: ${error.message}`);
	}
};

export const main = middy(catalogBatchProcess);