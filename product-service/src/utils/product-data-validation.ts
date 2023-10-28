import Ajv from 'ajv';

import { JoinedProductData } from '@interfaces/product';
import { productSchema } from '@constatns/product-validation-schema';

export const validateProductStructure = (productItem: JoinedProductData): boolean => {
   const ajv = new Ajv();

   return ajv.validate(productSchema, productItem)
}