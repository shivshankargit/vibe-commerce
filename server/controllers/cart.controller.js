const CartItem = require('../models/cartItem');

exports.getCart = async (req, res, next) => {
    try {
        const userId = req.user._id; 
        const cartItems = await CartItem.find({ userId }).populate('productId');
        
        const total = cartItems.reduce((acc, item) => {
        return item.productId ? acc + (item.productId.price * item.quantity) : acc;
        }, 0);

        res.json({ items: cartItems, total: total.toFixed(2) });
    } catch (err) {
        next(err);
    }
};

exports.addItemToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let existingItem = await CartItem.findOne({ productId, userId });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
            res.json(existingItem);
        } else {
            const newItem = await CartItem.create({ productId, quantity, userId });
            res.status(201).json(newItem);
        }
    } catch (err) {
        next(err);
    }
};

exports.removeItemFromCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const deletedItem = await CartItem.findOneAndDelete({ _id: req.params.id, userId });
        
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found in this user\'s cart' });
        }
        res.json({ message: 'Item removed successfully' });
    } catch (err) {
        next(err);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cartItemId = req.params.id;
        const { quantity } = req.body; 

        const updatedItem = await CartItem.findOneAndUpdate(
        { _id: cartItemId, userId: userId },
        { $set: { quantity: quantity } },
        { new: true } 
        );

        if (!updatedItem) {
        return res.status(404).json({ error: "Item not found in this user's cart" });
        }

        res.json(updatedItem); 
    } catch (err) {
        next(err);
    }
};