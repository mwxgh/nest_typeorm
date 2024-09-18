import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFieldTimeInContentsTable1726458141182 implements MigrationInterface {
    name = 'UpdateFieldTimeInContentsTable1726458141182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`released_at\` \`released_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`expired_at\` \`expired_at\` datetime(0) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`expired_at\` \`expired_at\` datetime(0) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`contents\` CHANGE \`released_at\` \`released_at\` datetime(0) NOT NULL`);
    }

}
