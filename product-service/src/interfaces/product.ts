export interface Product {
    description: string;
    id: string;
    price: number;
    title: string;
    img: string;
}

export interface Stock {
    count: number;
    product_id: string;
}

export interface JoinedProductData {
    description: string;
    id: string;
    price: number;
    title: string;
    img: string;
    count: number;
}

export type ProductList = JoinedProductData[];