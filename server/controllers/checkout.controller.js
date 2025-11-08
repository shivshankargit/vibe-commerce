const CartItem = require('../models/cartItem');
const User = require('../models/user'); 

exports.processCheckout = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { name, email } = req.body;

        const cartItems = await CartItem.find({ userId }).populate('productId');
        
        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Cannot checkout with an empty cart' });
        }
        
        const total = cartItems.reduce((acc, item) => {
            return item.productId ? acc + (item.productId.price * item.quantity) : acc;
        }, 0);

        const receipt = {
        user: { name, email },
        items: cartItems.map(item => ({
            name: item.productId.name,
            quantity: item.quantity,
            price: item.productId.price
        })),
        total: total.toFixed(2),
        timestamp: new Date().toISOString()
        };

        await CartItem.deleteMany({ userId });

        await User.findByIdAndUpdate(userId, { name, email });

        res.json({ message: 'Checkout successful!', receipt });
    } catch (err) {
        next(err);
    }
};