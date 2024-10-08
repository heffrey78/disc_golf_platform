import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '../entity/User';

dotenv.config({ path: '.env.test' });

// Set a default JWT secret for testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

// Create a test database connection
export const testDataSource = new DataSource({
    type: 'sqlite',
    database: ':memory:',
    entities: [User],
    synchronize: true,
    logging: false,
});

beforeAll(async () => {
    await testDataSource.initialize();
});

afterAll(async () => {
    await testDataSource.destroy();
});

// Increase the timeout for tests
jest.setTimeout(30000);