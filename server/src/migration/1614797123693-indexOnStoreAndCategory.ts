import { MigrationInterface, QueryRunner } from 'typeorm';

export class indexOnStoreAndCategory1614797123693 implements MigrationInterface {
  name = 'indexOnStoreAndCategory1614797123693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_ff0c0301a95e517153df97f681" ON "product" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_32eaa54ad96b26459158464379" ON "product" ("storeId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_32eaa54ad96b26459158464379"`);
    await queryRunner.query(`DROP INDEX "IDX_ff0c0301a95e517153df97f681"`);
  }
}
