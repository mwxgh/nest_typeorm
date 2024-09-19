import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryRelationsTable1726673265680 implements MigrationInterface {
    name = 'CreateCategoryRelationsTable1726673265680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category_relations\` (\`category_id\` int UNSIGNED NOT NULL, \`relation_id\` int UNSIGNED NOT NULL, \`type\` tinyint UNSIGNED NOT NULL DEFAULT '1', \`assigned_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_2ecc636d1e8d9a393582161e53\` (\`category_id\`, \`relation_id\`, \`type\`), PRIMARY KEY (\`category_id\`, \`relation_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category_relations\` ADD CONSTRAINT \`FK_9f41545d9d3450520a037200dbb\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category_relations\` ADD CONSTRAINT \`FK_e413720029236a9288024b6c6da\` FOREIGN KEY (\`relation_id\`) REFERENCES \`contents\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category_relations\` DROP FOREIGN KEY \`FK_e413720029236a9288024b6c6da\``);
        await queryRunner.query(`ALTER TABLE \`category_relations\` DROP FOREIGN KEY \`FK_9f41545d9d3450520a037200dbb\``);
        await queryRunner.query(`DROP INDEX \`IDX_2ecc636d1e8d9a393582161e53\` ON \`category_relations\``);
        await queryRunner.query(`DROP TABLE \`category_relations\``);
    }

}
