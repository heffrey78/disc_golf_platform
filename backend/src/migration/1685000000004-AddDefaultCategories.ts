import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultCategories1685000000004 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO category (name, description) VALUES
            ('General Discussion', 'General discussions about disc golf'),
            ('Technique & Form', 'Discussions about throwing techniques and form'),
            ('Equipment', 'Talk about discs, bags, and other equipment'),
            ('Tournaments & Events', 'Information about tournaments and events'),
            ('Course Reviews', 'Reviews and discussions about disc golf courses')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM category 
            WHERE name IN (
                'General Discussion',
                'Technique & Form',
                'Equipment',
                'Tournaments & Events',
                'Course Reviews'
            )
        `);
    }
}