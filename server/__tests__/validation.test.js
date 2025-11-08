const { cartItemSchema, checkoutSchema } = require('../validation');

describe('Validation Schemas', () => {

    describe('cartItemSchema', () => {
        it('should pass a valid cart item', () => {
        const result = cartItemSchema.safeParse({ productId: '12345', quantity: 1 });
        expect(result.success).toBe(true);
        });

        it('should fail if quantity is zero', () => {
        const result = cartItemSchema.safeParse({ productId: '12345', quantity: 0 });
        expect(result.success).toBe(false);
        });

        it('should fail if productId is missing', () => {
        const result = cartItemSchema.safeParse({ quantity: 1 });
        expect(result.success).toBe(false);
        });
    });

    describe('checkoutSchema', () => {
        it('should pass a valid checkout body', () => {
        const result = checkoutSchema.safeParse({ name: 'Test', email: 'test@example.com' });
        expect(result.success).toBe(true);
        });

        it('should fail an invalid email', () => {
        const result = checkoutSchema.safeParse({ name: 'Test', email: 'not-an-email' });
        expect(result.success).toBe(false);
        });

        it('should fail if name is missing', () => {
        const result = checkoutSchema.safeParse({ email: 'test@example.com' });
        expect(result.success).toBe(false);
        });
    });
});