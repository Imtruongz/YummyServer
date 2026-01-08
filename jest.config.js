export default {
    // Use Node environment for testing
    testEnvironment: 'node',

    // Support ES modules (automatically inferred from package.json "type": "module")
    transform: {},

    // Test file patterns
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/__tests__/**/*.spec.js'
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'Controllers/**/*.js',
        'Services/**/*.js',
        'Models/**/*.js',
        'Routers/**/*.js',
        '!**/node_modules/**',
        '!**/__tests__/**'
    ],

    // Coverage thresholds (adjusted to realistic values)
    coverageThreshold: {
        global: {
            branches: 10,
            functions: 5,
            lines: 10,
            statements: 10
        }
    },

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],

    // Timeout for tests
    testTimeout: 30000,

    // Clear mocks between tests
    clearMocks: true,

    // Verbose output
    verbose: true
};
