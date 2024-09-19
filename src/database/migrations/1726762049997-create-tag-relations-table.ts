import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTagRelationsTable1726762049997 implements MigrationInterface {
    name = 'CreateTagRelationsTable1726762049997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag_relations\` (\`tag_id\` int UNSIGNED NOT NULL, \`relation_id\` int UNSIGNED NOT NULL, \`type\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`assigned_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_0ba2f0aa46a3e2d739a42c854d\` (\`tag_id\`, \`relation_id\`, \`type\`), PRIMARY KEY (\`tag_id\`, \`relation_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tag_relations\` ADD CONSTRAINT \`FK_e72bdac534f2ca1c0d1a47311cf\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tag_relations\` ADD CONSTRAINT \`FK_13960282d36f0ab021e61740335\` FOREIGN KEY (\`relation_id\`) REFERENCES \`contents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tag_relations\` DROP FOREIGN KEY \`FK_13960282d36f0ab021e61740335\``);
        await queryRunner.query(`ALTER TABLE \`tag_relations\` DROP FOREIGN KEY \`FK_e72bdac534f2ca1c0d1a47311cf\``);
        await queryRunner.query(`DROP INDEX \`IDX_0ba2f0aa46a3e2d739a42c854d\` ON \`tag_relations\``);
        await queryRunner.query(`DROP TABLE \`tag_relations\``);
    }

}
