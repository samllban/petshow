import axios from 'axios';

const API_KEY = 'BHCu4w-Lr_bsq_FBamhj4g';

interface ProductData {
    description: string;
    price: number;

}
export const fetchProductByBarcode = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await axios.get(`https://api.cosmos.bluesoft.com.br/gtins/${barcode}`, {
            headers: {
                'X-Cosmos-Token': API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return null;
    }
};
