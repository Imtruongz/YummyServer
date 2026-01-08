import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load test environment
dotenv.config({ path: './.env.test' });

/**
 * Connect to test database
 */
export const connectTestDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/yummy_test';
        await mongoose.connect(mongoURL);
        console.log('Connected to test database');
    } catch (error) {
        console.error('Failed to connect to test database:', error);
        throw error;
    }
};

/**
 * Disconnect from test database
 */
export const disconnectTestDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Disconnected from test database');
    } catch (error) {
        console.error('Failed to disconnect from test database:', error);
        throw error;
    }
};

/**
 * Clear all collections in test database
 */
export const clearTestDB = async () => {
    try {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        console.log('Cleared test database');
    } catch (error) {
        console.error('Failed to clear test database:', error);
        throw error;
    }
};

/**
 * Generate random test email
 */
export const generateTestEmail = () => {
    return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
};

/**
 * Generate random test username
 */
export const generateTestUsername = () => {
    return `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * Create test user data
 */
export const createTestUserData = (overrides = {}) => {
    return {
        username: generateTestUsername(),
        email: generateTestEmail(),
        password: 'Test123456!',
        fullName: 'Test User',
        ...overrides
    };
};

/**
 * Create test food data
 */
export const createTestFoodData = (overrides = {}) => {
    return {
        foodName: `Test Food ${Date.now()}`,
        foodDescription: 'This is a delicious test food item',
        foodIngredients: ['ingredient1', 'ingredient2', 'ingredient3'],
        foodThumbnail: 'https://example.com/food.jpg',
        foodSteps: ['Step 1: Prepare', 'Step 2: Cook', 'Step 3: Serve'],
        CookingTime: '30 minutes',
        servings: 2,
        difficultyLevel: 'medium',
        categoryId: '',  // Will be overridden
        userId: '',      // Will be overridden
        ...overrides
    };
};

/**
 * Extract JWT token from response
 */
export const extractToken = (response) => {
    if (response.body && response.body.accessToken) {
        return response.body.accessToken;
    }
    return null;
};

/**
 * Wait for a specified time (for async operations)
 */
export const wait = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
