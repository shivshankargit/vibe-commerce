const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',                          
        required: true,
        index: true
    }
});

module.exports = mongoose.model('CartItem', CartItemSchema);