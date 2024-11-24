import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUsersTable1732474579586 implements MigrationInterface {
    name = 'AddRefreshTokenToUsersTable1732474579586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``);
    }

}
