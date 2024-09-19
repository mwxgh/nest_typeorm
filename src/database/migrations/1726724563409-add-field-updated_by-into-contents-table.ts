import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldUpdatedByIntoContentsTable1726724563409 implements MigrationInterface {
    name = 'AddFieldUpdatedByIntoContentsTable1726724563409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contents\` ADD \`updated_by\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`contents\` DROP FOREIGN KEY \`FK_d4ac344bac543ef5cc662ecb744\``);
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`created_by\` \`created_by\` int UNSIGNED NULL`);
        await queryRunner.query(`ALTER TABLE \`contents\` ADD CONSTRAINT \`FK_d4ac344bac543ef5cc662ecb744\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contents\` DROP FOREIGN KEY \`FK_d4ac344bac543ef5cc662ecb744\``);
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`created_by\` \`created_by\` int UNSIGNED NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`contents\` ADD CONSTRAINT \`FK_d4ac344bac543ef5cc662ecb744\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contents\` DROP COLUMN \`updated_by\``);
    }

}
