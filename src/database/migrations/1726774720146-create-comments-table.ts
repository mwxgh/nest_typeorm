import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1726774720146 implements MigrationInterface {
    name = 'CreateCommentsTable1726774720146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, \`content_id\` int UNSIGNED NOT NULL, \`parent_id\` int UNSIGNED NULL, \`detail\` text NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`priority\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`accepted_by\` int UNSIGNED NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_980bfefe00ed11685f325d0bd4c\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_5b217aacd02d43eba321c565516\` FOREIGN KEY (\`accepted_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4a8e07ff918d47d14b989d0766e\` FOREIGN KEY (\`content_id\`) REFERENCES \`contents\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_d6f93329801a93536da4241e386\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_d6f93329801a93536da4241e386\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4a8e07ff918d47d14b989d0766e\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_5b217aacd02d43eba321c565516\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_980bfefe00ed11685f325d0bd4c\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}
