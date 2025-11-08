module.exports = {
    setupFilesAfterEnv: ['./__tests__/setup.js'],
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/__tests__/setup.js'],
};