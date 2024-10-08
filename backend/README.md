# Disc Golf Platform Backend

This is the backend for the Disc Golf Platform application. It's built with Node.js, Express, TypeScript, and uses PostgreSQL as the database with TypeORM as the ORM.

## Setup

1. Make sure you have Node.js and npm installed on your machine.
2. Install dependencies:

```bash
npm install
```

3. Make sure you have Docker and Docker Compose installed for running the database.

## Running the Application

To start the application along with the database, use Docker Compose from the root directory:

```bash
docker-compose up
```

This will start both the backend server and the PostgreSQL database.

## Database Migrations

Migrations are handled automatically when the application starts. However, if you need to run migrations manually, you can use the following command:

```bash
npm run migration:run
```

To generate a new migration after changing an entity:

```bash
npm run migration:generate -- -n NameOfYourMigration
```

## Running Tests

To run the test suite:

```bash
npm test
```

## Development

For development, you can use the following command to start the server with hot-reloading:

```bash
npm run dev
```

## TypeScript Typechecking

To run TypeScript's type checker:

```bash
npm run typecheck
```

## Project Structure

- `src/entity/`: Contains TypeORM entities
- `src/migration/`: Contains database migrations
- `src/__tests__/`: Contains test files
- `src/index.ts`: The main application file

## API Documentation

(TODO: Add API documentation here or link to it)

Remember to keep this README updated as the project evolves!