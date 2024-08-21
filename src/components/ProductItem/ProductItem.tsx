import React from 'react';
import { Product } from '../../types/product';


interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
    return (
        <div className="product-item">
            <img src={product.photoUrl} alt={product.name} className="product-photo" />
            <h2>{product.name}</h2>
            <ul>
                {product.variations.map((variation, index) => (
                    <li key={index}>
                        <p>Variation: {variation.variationName}</p>
                        <p>Price: ${variation.price.toFixed(2)}</p>
                        <p>Stock: {variation.stock} units</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductItem;
