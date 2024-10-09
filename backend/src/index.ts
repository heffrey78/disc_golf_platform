import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./entity/User";
import { Thread } from "./entity/Thread";
import { Post } from "./entity/Post";
import { Category } from "./entity/Category";
import { Subforum } from "./entity/Subforum";
import userRoutes from "./routes/userRoutes";
import forumRoutes from "./routes/forumRoutes";

dotenv.config();

export const createApp = (dataSource: DataSource) => {
    const app = express();
    
    // Enable CORS for all routes
    app.use(cors());
    
    app.use(express.json());

    // Middleware to make dataSource available in req object
    app.use((req, res, next) => {
        (req as any).dataSource = dataSource;
        next();
    });

    app.use('/api/users', userRoutes);
    app.use('/api/forum', forumRoutes);

    // Basic error handling
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return app;
};

export const getDataSourceConfig = (): DataSourceOptions => {
    const baseConfig = {
        entities: [User, Thread, Post, Category, Subforum],
        migrations: [__dirname + "/migration/**/*.ts"],
        synchronize: false,
        logging: false,
    };

    if (process.env.NODE_ENV === 'test') {
        return {
            ...baseConfig,
            type: 'sqlite',
            database: ':memory:',
            synchronize: true, // For testing, we can use synchronize
        };
    } else {
        return {
            ...baseConfig,
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        };
    }
};

export const AppDataSource = new DataSource(getDataSourceConfig());

export const initializeApp = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        if (process.env.NODE_ENV !== 'test') {
            // Run migrations only in non-test environments
            await AppDataSource.runMigrations();
            console.log("Migrations have been executed");
        }

        const app = createApp(AppDataSource);
        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        return app;
    } catch (err) {
        console.error("Error during Data Source initialization", err);
        throw err;
    }
};

if (require.main === module) {
    initializeApp();
}