import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: './.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Note: testTimeout is already configured in jest.config.js (30000ms)

// Global test utilities
global.testUtils = {
    // Helper to create test user data
    createTestUser: () => ({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Test123456!',
        fullName: 'Test User'
    }),

    // Helper to create test food data
    createTestFood: () => ({
        name: `Test Food ${Date.now()}`,
        description: 'Delicious test food',
        price: 50000,
        category: 'Test Category',
        ingredients: ['ingredient1', 'ingredient2']
    })
};

// Suppress console logs in tests to reduce noise
// Comment these out if you want to see console output during tests
const originalConsole = { ...console };
global.console = {
    ...console,
    log: () => { },
    debug: () => { },
    info: () => { },
    warn: () => { },
    // Keep error for debugging test failures
    error: originalConsole.error,
};
