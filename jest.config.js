module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    coverageDirectory: 'docs/coverage',
};

// More options can be specified, I think this is enough for now