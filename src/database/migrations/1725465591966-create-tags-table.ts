import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagsTable1725465591966 implements MigrationInterface {
    name = 'CreateTagsTable1725465591966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', UNIQUE INDEX \`IDX_b3aa10c29ea4e61a830362bd25\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b3aa10c29ea4e61a830362bd25\` ON \`tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
    }

}
