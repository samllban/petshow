import axios from "axios";


const api = axios.create({
    baseURL: 'https://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
    },
})

export const saveProduct = async (formData: number | string | null) => {
    try {
        const response = await api.post('/products', formData);
        return response.data; // Retorna os dados do produto salvo
    } catch (error) {
        console.error('Erro ao salvar o produto:', error);
        throw error;
    }
};