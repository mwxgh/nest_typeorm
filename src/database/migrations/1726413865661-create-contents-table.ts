import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContentsTable1726413865661 implements MigrationInterface {
    name = 'CreateContentsTable1726413865661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contents\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`title\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`summary\` varchar(255) NOT NULL, \`detail\` text NOT NULL, \`status\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`priority\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`type\` tinyint UNSIGNED NOT NULL DEFAULT '0', \`created_by\` int UNSIGNED NOT NULL, \`released_by\` int UNSIGNED NULL, \`released_at\` datetime(0) NOT NULL, \`expired_at\` datetime(0) NOT NULL, UNIQUE INDEX \`IDX_8a8cf14dab55b4ebcd93bb536a\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`contents\` ADD CONSTRAINT \`FK_d4ac344bac543ef5cc662ecb744\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contents\` ADD CONSTRAINT \`FK_2411aa2bfe9b67377b1c325afa7\` FOREIGN KEY (\`released_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contents\` DROP FOREIGN KEY \`FK_2411aa2bfe9b67377b1c325afa7\``);
        await queryRunner.query(`ALTER TABLE \`contents\` DROP FOREIGN KEY \`FK_d4ac344bac543ef5cc662ecb744\``);
        await queryRunner.query(`DROP INDEX \`IDX_8a8cf14dab55b4ebcd93bb536a\` ON \`contents\``);
        await queryRunner.query(`DROP TABLE \`contents\``);
    }

}
