import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1704994286211 implements MigrationInterface {
  name = 'CreateUsersTable1704994286211'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`created_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW(), \`deleted_at\` datetime(0) NULL, \`created_by\` int UNSIGNED NULL, \`updated_by\` int UNSIGNED NULL, \`role\` tinyint UNSIGNED NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`email\` varchar(255) NULL, \`session_id\` varchar(255) NULL, \`status\` tinyint UNSIGNED NOT NULL, \`is_locked\` tinyint UNSIGNED NOT NULL, \`is_deleted\` tinyint UNSIGNED NOT NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    )
    await queryRunner.query(`DROP TABLE \`users\``)
  }
}
