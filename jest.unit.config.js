module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/unit/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage/unit',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};