import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaRelationsTable1726766677915 implements MigrationInterface {
    name = 'CreateMediaRelationsTable1726766677915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`media_relations\` (\`media_id\` int UNSIGNED NOT NULL, \`relation_id\` int UNSIGNED NOT NULL, \`type\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`assigned_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_a45637cfbb668534d37993607c\` (\`media_id\`, \`relation_id\`, \`type\`), PRIMARY KEY (\`media_id\`, \`relation_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`media_relations\` ADD CONSTRAINT \`FK_4ba5a5a57a2419210a8d9ed2e65\` FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`media_relations\` ADD CONSTRAINT \`FK_c98f0eb7f5fa11132ac73f39302\` FOREIGN KEY (\`relation_id\`) REFERENCES \`contents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media_relations\` DROP FOREIGN KEY \`FK_c98f0eb7f5fa11132ac73f39302\``);
        await queryRunner.query(`ALTER TABLE \`media_relations\` DROP FOREIGN KEY \`FK_4ba5a5a57a2419210a8d9ed2e65\``);
        await queryRunner.query(`DROP INDEX \`IDX_a45637cfbb668534d37993607c\` ON \`media_relations\``);
        await queryRunner.query(`DROP TABLE \`media_relations\``);
    }

}
