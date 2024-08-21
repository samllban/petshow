// types/Product.tsx

export interface Variation {
    variationName: string;
    stock: number;
    price: number;
}

export interface Product {
    id: string;
    name: string;
    photoUrl: string;
    variations: Variation[];
}
