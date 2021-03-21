import {MigrationInterface, QueryRunner} from "typeorm";

export class productStatsView1614251905772 implements MigrationInterface {
    name = 'productStatsView1614251905772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE MATERIALIZED VIEW "product_statistic" AS 
  select z.*, 
  (1 - z."priceCurrent" / z."priceMode")::numeric(10,2) as "discount"
  from (
  select p.id, calc."priceMean", calc."priceMode", (
    select x.value as "priceCurrent"
    from price x
    where x."productId" = p.id
    order by "createdAt" desc
    limit 1
  ) as "priceCurrent"
  from product p
  left join (
    select pr."productId", avg(pr.value)::NUMERIC(10,2) as "priceMean",
    mode() within group(order by pr.value) as "priceMode"
    from price pr
    group by pr."productId"
  ) as calc on calc."productId" = p.id 
  where calc."productId" = p.id
  order by p.id
  ) as z;
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`, ["VIEW","public","product_statistic","select z.*, \n  (1 - z.\"priceCurrent\" / z.\"priceMode\")::numeric(10,2) as \"discount\"\n  from (\n  select p.id, calc.\"priceMean\", calc.\"priceMode\", (\n    select x.value as \"priceCurrent\"\n    from price x\n    where x.\"productId\" = p.id\n    order by \"createdAt\" desc\n    limit 1\n  ) as \"priceCurrent\"\n  from product p\n  left join (\n    select pr.\"productId\", avg(pr.value)::NUMERIC(10,2) as \"priceMean\",\n    mode() within group(order by pr.value) as \"priceMode\"\n    from price pr\n    group by pr.\"productId\"\n  ) as calc on calc.\"productId\" = p.id \n  where calc.\"productId\" = p.id\n  order by p.id\n  ) as z;"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = 'VIEW' AND "schema" = $1 AND "name" = $2`, ["public","product_statistic"]);
        await queryRunner.query(`DROP MATERIALIZED VIEW "product_statistic"`);
    }

}
