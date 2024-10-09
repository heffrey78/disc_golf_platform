import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateForumTables1685000000003 implements MigrationInterface {
    name = 'CreateForumTables1685000000003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subforum" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_050f1f8603302a7f31b69bca59b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "threadId" integer, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "thread" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subforumId" integer, "authorId" integer, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subforum" ADD CONSTRAINT "FK_455e5c62f414560cbe34255c9c7" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_b148d2f5a22e7904160c69b09f8" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_018f5acd8332d9d3324dddb1b12" FOREIGN KEY ("subforumId") REFERENCES "subforum"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_7060c5e0b10f141ce2ca501bc13" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_7060c5e0b10f141ce2ca501bc13"`);
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_018f5acd8332d9d3324dddb1b12"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_b148d2f5a22e7904160c69b09f8"`);
        await queryRunner.query(`ALTER TABLE "subforum" DROP CONSTRAINT "FK_455e5c62f414560cbe34255c9c7"`);
        await queryRunner.query(`DROP TABLE "thread"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "subforum"`);
    }
}
