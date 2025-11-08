const axios = require('axios');
const Product = require('./models/product');
const CartItem = require('./models/cartItem');
const User = require('./models/user');

const seedDatabase = async () => {
    try {
        const productCount = await Product.countDocuments();
        if (productCount > 0) {
        console.log('Database already seeded. Skipping.');
        return;
        }

        console.log('No products found. Seeding from Fake Store API...');
        
        const response = await axios.get('https://fakestoreapi.com/products?limit=10');
        const apiProducts = response.data;

        const productsToSeed = apiProducts.map(apiProduct => ({
        name: apiProduct.title,
        price: apiProduct.price,
        imageUrl: apiProduct.image
        }));

        await Product.insertMany(productsToSeed);
        
        await CartItem.deleteMany({});
        await User.deleteMany({});
        
        console.log('Database seeded with 10 products!');

    } catch (err) {
        console.error('Error seeding database:', err.message);
    }
};

module.exports = { seedDatabase };