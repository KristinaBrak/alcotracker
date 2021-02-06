import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { Category } from '../entity/Category';
import { categorySeed } from '../seed/category.seed';

export class SeedCategory1612619827781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const categoryRepository = getRepository(Category);
    await categoryRepository.save(categorySeed);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
