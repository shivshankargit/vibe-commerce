const mongoose = require("mongoose");

async function connectDb() {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`);

    } catch (error) {
        console.log(" Error connection to MongoDb: ", error.message);
        process.exit(1);
    }
}

module.exports = connectDb;