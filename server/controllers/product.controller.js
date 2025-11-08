const Product = require('../models/product');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err); // Pass error to central handler
    }
};