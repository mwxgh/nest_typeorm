import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoriesTableWithDescendants1725977370360 implements MigrationInterface {
    name = 'UpdateCategoriesTableWithDescendants1725977370360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` ADD \`parentId\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_id\` \`parent_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` ADD CONSTRAINT \`FK_9a6f051e66982b5f0318981bcaa\` FOREIGN KEY (\`parentId\`) REFERENCES \`categories\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_9a6f051e66982b5f0318981bcaa\``);
        await queryRunner.query(`ALTER TABLE \`categories\` CHANGE \`parent_id\` \`parent_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`parentId\``);
    }

}
