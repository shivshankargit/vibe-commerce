const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { seedDatabase } = require('../seeder'); // Import your seeder

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri);
    
    await seedDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
