import "reflect-metadata";
import { DataSource } from "typeorm";
import express from "express";
import dotenv from "dotenv";
import { User } from "./entity/User";
import userRoutes from "./routes/userRoutes";

dotenv.config();

export const createApp = (dataSource: DataSource) => {
    const app = express();
    app.use(express.json());

    app.use('/api/users', userRoutes);

    // Basic error handling
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    return app;
};

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [User],
    migrations: [__dirname + "/migration/**/*.ts"],
    synchronize: false,
    logging: false,
});

export const initializeApp = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source has been initialized!");

        // Run migrations
        await AppDataSource.runMigrations();
        console.log("Migrations have been executed");

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