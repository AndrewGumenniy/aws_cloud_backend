export enum StatuseCodeList {
    Success = 200,
    ServerError = 500,
    NotFound = 404
}

export const PRODUCTS_NOT_FOUND_ERROR_MESSAGE = ({ id }): string => `Product with id = ${id} not found`;