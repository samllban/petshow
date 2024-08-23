import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import Header from "../Header/Header";
import shapooImage from '../../../public/img/shapoo_product1.jpg';
import soapImage from '../../../public/img/soap_project2.jpg';
import portionImage from '../../../public/img/delails_product.jpg';

const ProductHighlight = ({ product }: { product: Product }) => {
    return (
        <div className="mt-8 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
            <header>
                <h5 className='text-3xl font-bold text-gray-800 mt-4'>Product Details:</h5>
            </header>
            <h6  className="text-xl font-bold text-gray-800 mt-4">{product.name}</h6>
            <ul className='mt-4 space-y-2'>
                {product.variations.map((variation, index) => (
                    <li key={index}>
                        <p><strong>Variation:</strong> {variation.variationName}</p>
                        <p><strong>Price:</strong> R${variation.price.toFixed(2)}</p>
                        <p><strong>stock:</strong> {variation.stock} units</p>
                    </li>
                ))}
            </ul>
            <footer className='mt-6 flex justify-between items center'>
                <div className="text-gray-700">
                    <em>from:</em>
                    <strong>{Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL'}).format(Math.min(...product.variations.map(v => v.price)))}</strong>
                </div>
                <div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300">Comprar</button>
                </div>
            </footer>
        </div>
    );
};

const FeaturedProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async (): Promise<Product[]> => {
            return [
                {
                    id: '1',
                    name: 'shampoo',
                    photoUrl: shapooImage,
                    variations: [
                        { variationName: 'petshow1', stock: 10, price: 19.99 },
                        { variationName: 'petshow2', stock: 5, price: 24.99 },
                    ],
                },
                {
                    id: '2',
                    name: 'soap 2',
                    photoUrl: soapImage,
                    variations: [
                        { variationName: 'petshow 1', stock: 20, price: 29.99 },
                    ],
                },
                {
                    id: '3',
                    name: ' Portion 3',
                    photoUrl: portionImage ,
                    variations: [ 
                        { variationName: 'Variação 1', stock: 15, price: 39}
                    ]
                }
            ];
        };

        const loadProducts = async () => {
            const products = await fetchProducts();
            setProducts(products);
            setSelectedProduct(products[0]);
        };

        loadProducts();
    }, []);

    return (
        <>
        <Header />
        <section className="flex flex-col items-center bg-gray-200 py-12">
            <div className="w-full max-w-4xl">
                <ul className="flex justify-center gap-3">
                    {products.map(product => (
                        <li 
                            key={product.id}
                            onClick={() => setSelectedProduct(product)} 
                            className={`cursor-pointer transition-all duration-500 ease-in-out ${selectedProduct?.id === product.id ? 'scale-110' : ''}`}
                        >
                            <img 
                                src={product.photoUrl} 
                                alt={`Imagem do produto 
                                ${product.name}`} 
                                className={`w-32 transition-all duration-500 ease-in-out ${selectedProduct?.id === product.id ? 'w-48' : ''}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            {selectedProduct && <ProductHighlight product={selectedProduct} />}
        </section>
        </>
    );
};

export default FeaturedProducts;
