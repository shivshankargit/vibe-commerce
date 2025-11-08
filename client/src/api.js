import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

let mockUserId = localStorage.getItem('mockUserId');
if (!mockUserId) {
    mockUserId = `user_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem('mockUserId', mockUserId);
}

api.interceptors.request.use((config) => {
    config.headers['x-user-id'] = mockUserId;
    return config;
});

export const emitCartUpdated = () => {
    window.dispatchEvent(new CustomEvent('cart:updated'));
};

export const getProducts = () => api.get('/products');
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity) => api.post('/cart', { productId, quantity });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);
export const checkout = (userData) => api.post('/checkout', userData);
export const updateCartQuantity = (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity });
