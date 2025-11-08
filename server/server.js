const express = require('express');
const dotenv = require ("dotenv");
const cors = require('cors');
const connectDb = require("./db/db");
const cookieParser = require("cookie-parser");
dotenv.config();

// --- IMPORT YOUR SEEDER ---
const { seedDatabase } = require('./seeder');

const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoute');
const checkoutRoutes = require('./routes/checkedRoute');

const { mockUserAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/cart', mockUserAuth, cartRoutes);
app.use('/api/checkout', mockUserAuth, checkoutRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).json({
        error: 'An unexpected server error occurred.',
        message: err.message
    });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, async () => {
        await connectDb();
        await seedDatabase(); 
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;