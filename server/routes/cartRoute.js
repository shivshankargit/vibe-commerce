const express = require('express');
const router = express.Router();
const { getCart, addItemToCart, removeItemFromCart, updateCartItem } = require('../controllers/cart.controller');
const { validate, cartItemSchema, updateQuantitySchema } = require('../validation');

router.get('/', getCart)
router.post('/', validate(cartItemSchema), addItemToCart);
router.delete('/:id', removeItemFromCart);
router.put('/:id', validate(updateQuantitySchema), updateCartItem);

module.exports = router;