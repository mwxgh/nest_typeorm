import { MigrationInterface, QueryRunner } from 'typeorm'

export class RemoveIsDeletedOnUsersTable1706005731952
  implements MigrationInterface
{
  name = 'RemoveIsDeletedOnUsersTable1706005731952'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_deleted\``)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`is_deleted\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    )
  }
}
