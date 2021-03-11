import { ProductSort, SortableField } from "../generated/graphql";

const DEFAULT_SORT = "discount.desc";

export const parseSortQuery = (sort: string | string[]): ProductSort[] => {
  const sortQuery = typeof sort === "string" ? sort : null;
  const sortEntries = sortQuery ? sortQuery.split(",") : [DEFAULT_SORT];

  return sortEntries.reduce<ProductSort[]>((acc, sortEntry) => {
    const [field, order] = sortEntry.split(".");
    const isValidField = Object.values(SortableField).some(
      (sf) => sf.toLowerCase() === field.toLowerCase()
    );

    return isValidField
      ? [...acc, { field, order: order.toUpperCase() } as ProductSort]
      : acc;
  }, []);
};
