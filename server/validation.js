const { z } = require('zod');

const cartItemSchema = z.object({
    productId: z.string().trim().min(1, "Product ID is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1")
});

const checkoutSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    email: z.string().email("Invalid email format")
});

const updateQuantitySchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next(); 
    } catch (e) {
        res.status(400).json({ error: "Validation failed", details: e.errors });
    }
};

module.exports = { cartItemSchema, checkoutSchema, updateQuantitySchema, validate };