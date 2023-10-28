export enum StatuseCodeList {
    Success = 200,
    BadRequest = 400,
    NotFound = 404,
    ServerError = 500
}

export const PRODUCTS_NOT_FOUND_ERROR_MESSAGE = ({ id }): string => `Product with id ${id} not found`;
export const PRODUCT_ALREADY_EXISTS = ({ id }): string => `Product with id ${id} already exists!`;
export const PRODUCT_DATA_IS_INVALID = "Product data is invalid";
export const EMPTY_BODY = "Empty body";