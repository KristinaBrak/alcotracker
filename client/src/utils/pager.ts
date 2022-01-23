import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";
import { buildFilterParams } from "./filter";

export const getPageFromQuery = (query: ParsedUrlQuery) => {
  const [pageParam] = Object.entries(query)
    .filter(([key]) => key === "page")
    .map(([key, value]) => [
      key,
      typeof value === "string" ? value : value?.[0],
    ]);
  if (pageParam && pageParam[1]) {
    const value = pageParam[1];
    const result = Number(value);
    return isNaN(result) ? 1 : result;
  }
  return 1;
};

const setUrlPage = (router: NextRouter, page: number) => {
  const query = router.query;
  router.push({
    query: buildFilterParams({
      ...query,
      page: page.toString(),
    }),
  });
};

export const clearPage = (router: NextRouter) => {
  setUrlPage(router, 1);
};

export const usePagination = (onPageChange: (currentPage: number) => void) => {
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const urlPage = getPageFromQuery(router.query);
    if (page !== urlPage) {
      setPage(urlPage);
      onPageChange(urlPage);
    }
  }, []);

  useEffect(() => {
    const urlPage = getPageFromQuery(router.query);
    if (page !== urlPage) {
      setPage(urlPage);
      onPageChange(urlPage);
    } else {
      setPage(1);
      setUrlPage(router, 1);
    }
  }, [JSON.stringify(router.query)]);

  const next = () => setUrlPage(router, page + 1);
  const previous = () => setUrlPage(router, page > 1 ? page - 1 : 1);
  const firstPage = () => setUrlPage(router, 1);
  return { page, next, previous, firstPage };
};
