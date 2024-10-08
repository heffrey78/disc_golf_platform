import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { getDataSourceConfig } from '../index';

dotenv.config({ path: '.env.test' });

// Set the environment to 'test'
process.env.NODE_ENV = 'test';

// Set a default JWT secret for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Create a test database connection using the same configuration function as the main app
export const testDataSource = new DataSource(getDataSourceConfig());

beforeAll(async () => {
    await testDataSource.initialize();
});

afterAll(async () => {
    await testDataSource.destroy();
});

// Increase the timeout for tests
jest.setTimeout(30000);