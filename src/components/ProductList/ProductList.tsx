// components/ProductList.tsx

import React, { useEffect, useState } from 'react';
import ProductItem from '../ProductItem/ProductItem';
import { Product } from '../../types/product';

// Função simulada para buscar produtos (substituir por uma chamada real ao banco de dados)
const fetchProducts = async (): Promise<Product[]> => {
    // Substitua por sua lógica para buscar os produtos do Realtime Database.
    return [
        {
            id: '1',
            name: 'Product 1',
            photoUrl: 'link-to-photo-1.jpg',
            variations: [
                { variationName: 'Variation 1', stock: 10, price: 19.99 },
                { variationName: 'Variation 2', stock: 5, price: 24.99 },
            ],
        },
        {
            id: '2',
            name: 'Product 2',
            photoUrl: 'link-to-photo-2.jpg',
            variations: [
                { variationName: 'Variation 1', stock: 20, price: 29.99 },
            ],
        },
    ];
};

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const products = await fetchProducts();
            setProducts(products);
        };

        loadProducts();
    }, []);

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductItem key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
