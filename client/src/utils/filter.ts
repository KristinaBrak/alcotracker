import { ParsedUrlQuery } from "node:querystring";
import { ProductDtoFilter } from "../generated/graphql";

const FILTER_KEYS = [
  "name_like",
  "discount_gte",
  "discount_lte",
  "priceCurrent_lte",
  "priceCurrent_gte",
  "category_like",
  "alcVolume_lte",
  "alcVolume_gte",
  "volume_lte",
  "volume_gte",
  "store_like",
];

export const buildFilterParams = (filter: unknown) => {
  const result = Object.entries(filter).filter(([, value]) => Boolean(value));
  return Object.fromEntries(result);
};

export const parseFilterQuery = (query: ParsedUrlQuery): ProductDtoFilter => {
  const entries = Object.entries(query)
    .filter(([key]) => FILTER_KEYS.includes(key))
    .map(([key, value]) => [
      key,
      typeof value === "string" ? value : value?.[0],
    ]);
  const params = Object.fromEntries(entries);
  const result = {
    name_like: params.name_like,
    discount_gte: Number(params.discount_gte) || undefined,
    discount_lte: Number(params.discount_lte) || undefined,
    priceCurrent_lte: Number(params.priceCurrent_lte) || undefined,
    priceCurrent_gte: Number(params.priceCurrent_gte) || undefined,
    category_like: params.category_like,
    alcVolume_lte: Number(params.alcVolume_lte) || undefined,
    alcVolume_gte: Number(params.alcVolume_gte) || undefined,
    volume_lte: Number(params.volume_lte) || undefined,
    volume_gte: Number(params.volume_gte) || undefined,
    store_like: params.store_like,
  };

  return result;
};
