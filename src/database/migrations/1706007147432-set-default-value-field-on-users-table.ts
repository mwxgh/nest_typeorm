import { MigrationInterface, QueryRunner } from 'typeorm'

export class SetDefaultValueFieldOnUsersTable1706007147432
  implements MigrationInterface
{
  name = 'SetDefaultValueFieldOnUsersTable1706007147432'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint UNSIGNED NOT NULL DEFAULT '1'`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_locked\` \`is_locked\` tinyint UNSIGNED NOT NULL DEFAULT '0'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_locked\` \`is_locked\` tinyint UNSIGNED NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint UNSIGNED NOT NULL`,
    )
  }
}
