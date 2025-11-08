// src/mocks/handlers.js
import { http, HttpResponse } from 'msw'

const API_URL = 'http://localhost:3000/api'

const mockProducts = [
    { _id: '1', name: 'Mock Product 1', price: 10, imageUrl: 'img1.jpg' },
    { _id: '2', name: 'Mock Product 2', price: 20, imageUrl: 'img2.jpg' },
]
const mockEmptyCart = { items: [], total: '0.00' }

export const handlers = [
    http.get(`${API_URL}/products`, () => {
        return HttpResponse.json(mockProducts)
    }),

    http.get(`${API_URL}/cart`, () => {
        return HttpResponse.json(mockEmptyCart)
    }),

    http.post(`${API_URL}/cart`, async ({ request }) => {
        const { productId } = await request.json()
        const product = mockProducts.find(p => p._id === productId)
        return HttpResponse.json(
        { _id: 'c1', productId: product._id, quantity: 1 },
        { status: 201 }
        )
    }),

    http.put(`${API_URL}/cart/:id`, async ({ request }) => {
        const { quantity } = await request.json()
        return HttpResponse.json({ _id: 'c1', quantity: quantity })
    }),
    
    http.post(`${API_URL}/checkout`, async ({ request }) => {
        const { name, email } = await request.json()
        return HttpResponse.json({
            message: 'Checkout successful!',
            receipt: { 
                _id: 'r1', 
                user: { name, email }, 
                total: '10.00', 
                timestamp: new Date().toISOString() 
            }
        })
    }),
]