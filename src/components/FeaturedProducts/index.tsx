import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
//import { Link } from 'react-router-dom';
import Header from "../Header/Header";

const ProductHighlight = ({ product }: { product: Product }) => {
    return (
        <div className="mt-8 w-full max-w-md p-4 bg-white rounded-lg shadow-lg">
            <header>
                <h5 className='text-3xl font-bold text-gray-800 mt-4'>Detalhes do Produto:</h5>
            </header>
            <h6  className="text-xl font-bold text-gray-800 mt-4">{product.name}</h6>
            <ul className='mt-4 space-y-2'>
                {product.variations.map((variation, index) => (
                    <li key={index}>
                        <p><strong>Variação:</strong> {variation.variationName}</p>
                        <p><strong>Preço:</strong> R${variation.price.toFixed(2)}</p>
                        <p><strong>Estoque:</strong> {variation.stock} unidades</p>
                    </li>
                ))}
            </ul>
            <footer className='mt-6 flex justify-between items center'>
                <div className="text-gray-700">
                    <em>A partir de:</em>
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
                    name: 'Produto 1',
                    photoUrl: 'link-to-photo-1.jpg',
                    variations: [
                        { variationName: 'Variação 1', stock: 10, price: 19.99 },
                        { variationName: 'Variação 2', stock: 5, price: 24.99 },
                    ],
                },
                {
                    id: '2',
                    name: 'Produto 2',
                    photoUrl: 'link-to-photo-2.jpg',
                    variations: [
                        { variationName: 'Variação 1', stock: 20, price: 29.99 },
                    ],
                },
                {
                    id: '3',
                    name: 'Produto 3',
                    photoUrl: 'link-to-photo-3.jpg',
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
        <section className="flex flex-col items-center bg-gray-200 py-12">
            <Header />
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
    );
};

export default FeaturedProducts;
