import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReactionsTable1727168714609 implements MigrationInterface {
    name = 'CreateReactionsTable1727168714609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reactions\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NOT NULL, \`content_id\` int UNSIGNED NOT NULL, \`comment_id\` int UNSIGNED NULL, \`type\` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_8d9cb4411b9022d5fb8f1aa9444\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_278686161f5cf2f1910dfcb44c5\` FOREIGN KEY (\`content_id\`) REFERENCES \`contents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reactions\` ADD CONSTRAINT \`FK_bbea5deba8e9118ad08429c9104\` FOREIGN KEY (\`comment_id\`) REFERENCES \`comments\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY \`FK_bbea5deba8e9118ad08429c9104\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY \`FK_278686161f5cf2f1910dfcb44c5\``);
        await queryRunner.query(`ALTER TABLE \`reactions\` DROP FOREIGN KEY \`FK_8d9cb4411b9022d5fb8f1aa9444\``);
        await queryRunner.query(`DROP TABLE \`reactions\``);
    }

}
