const request = require('supertest');
const app = require('../server'); 
const Product = require('../models/product');

const MOCK_USER_ID = 'test-user-for-api';

describe('Vibe E-Com API', () => {

    describe('GET /api/products', () => {
        it('should return 10 mock products from the seeder', async () => {
        const res = await request(app).get('/api/products');
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toBe(10);
        expect(res.body[0]).toHaveProperty('name');
        });
    });

    describe('Auth Middleware', () => {
        it('should return 401 if x-user-id header is missing', async () => {
        const res = await request(app).get('/api/cart');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('x-user-id header is missing');
        });
    });

    
    describe('Full Cart Flow', () => {
        let productId; 
        let cartItemId; 

        it('GET /api/cart - should return an empty cart for a new user', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('x-user-id', MOCK_USER_ID); 

        expect(res.statusCode).toBe(200);
        expect(res.body.items).toEqual([]);
        expect(res.body.total).toBe("0.00");
        });

        it('POST /api/cart - should add an item to the cart', async () => {
        const product = await Product.findOne();
        productId = product._id.toString();

        const res = await request(app)
            .post('/api/cart')
            .set('x-user-id', MOCK_USER_ID)
            .send({
            productId: productId,
            quantity: 2
            });
        
        expect(res.statusCode).toBe(201);
        expect(res.body.productId).toBe(productId);
        expect(res.body.quantity).toBe(2);
        
        cartItemId = res.body._id; 
        });

        it('POST /api/cart - should fail validation for bad data', async () => {
        const res = await request(app)
            .post('/api/cart')
            .set('x-user-id', MOCK_USER_ID)
            .send({
            productId: productId,
            quantity: -1 
            });
        
        expect(res.statusCode).toBe(400); 
        expect(res.body.error).toBe('Validation failed');
        });
        
        it('GET /api/cart - should now return the added item', async () => {
        const res = await request(app)
            .get('/api/cart')
            .set('x-user-id', MOCK_USER_ID);

        expect(res.statusCode).toBe(200);
        expect(res.body.items.length).toBe(1);
        expect(res.body.items[0].productId._id).toBe(productId);
        expect(res.body.items[0].quantity).toBe(2);
        expect(parseFloat(res.body.total)).toBeGreaterThan(0);
        });

        it('DELETE /api/cart/:id - should remove the item from the cart', async () => {
        const res = await request(app)
            .delete(`/api/cart/${cartItemId}`)
            .set('x-user-id', MOCK_USER_ID);
            
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Item removed successfully');
        });

        it('POST /api/checkout - should fail for an empty cart', async () => {
        const res = await request(app)
            .post('/api/checkout')
            .set('x-user-id', MOCK_USER_ID)
            .send({ name: 'Test User', email: 'test@example.com' });
            
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Cannot checkout with an empty cart');
        });

        it('POST /api/checkout - should succeed for a non-empty cart', async () => {
        // 1. Add an item back to the cart
        await request(app)
            .post('/api/cart')
            .set('x-user-id', MOCK_USER_ID)
            .send({ productId: productId, quantity: 1 });

        // 2. Now, checkout
        const res = await request(app)
            .post('/api/checkout')
            .set('x-user-id', MOCK_USER_ID)
            .send({ name: 'Test User', email: 'test@example.com' });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Checkout successful!');
        expect(res.body.receipt).toHaveProperty('total');
        expect(res.body.receipt.user.name).toBe('Test User');
        });
    });
});