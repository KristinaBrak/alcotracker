delete from product pt
where exists 
(
select 1 from
	(
	select prod.id as id, prod.name as name, p1."createdAt" as "lastDate"
	from product prod 
	join price p1 on (prod.id  = p1."productId")
	left outer join price p2 on (prod.id = p2."productId" and 
		(p1."createdAt" < p2."createdAt" or (p1."createdAt" = p2."createdAt" and p1.id < p2.id)))
	where p2.id is null 
		and p1."createdAt" < now() - interval '1 week'
	) as oldproduct
where oldproduct.id = pt.id
);