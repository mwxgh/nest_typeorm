import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoriesTable1724749103477 implements MigrationInterface {
    name = 'CreateCategoriesTable1724749103477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, \`parent_id\` int NULL, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', UNIQUE INDEX \`IDX_420d9f679d41281f282f5bc7d0\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_420d9f679d41281f282f5bc7d0\` ON \`categories\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
    }

}
