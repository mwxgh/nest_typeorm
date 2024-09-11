import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaTable1726050377800 implements MigrationInterface {
    name = 'CreateMediaTable1726050377800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, \`original_name\` varchar(255) NOT NULL, \`filename\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`mimetype\` varchar(255) NOT NULL, \`url\` varchar(500) NOT NULL, \`dimension\` json NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`media\``);
    }

}
