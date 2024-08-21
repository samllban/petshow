// pages/Home.tsx

import React from 'react';
import ProductList from '../components/ProductList/ProductList';

const Home: React.FC = () => {
    return (
        <div className="home-page">
            <h1>Product List</h1>
            <ProductList />
        </div>
    );
};

export default Home;
