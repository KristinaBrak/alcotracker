import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useReducer } from "react";
import { useEffect } from "react";
import { buildFilterParams } from "../../utils/filter";

type Props = {
  take: number;
  setSkip: (value: number) => void;
};

type State = {
  page: number;
};

type Action =
  | { type: "inc" }
  | { type: "dec" }
  | { type: "set"; payload: number }
  | { type: "start" };

const initialState = { page: 1 };
const PageReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "inc":
      return { ...state, page: state.page + 1 };
    case "dec":
      return { ...state, page: state.page > 1 ? state.page - 1 : 1 };
    case "set":
      return { ...state, page: action.payload };
    case "start":
      return { ...state, page: 1 };
  }
};

const getPageFromQuery = (query: ParsedUrlQuery) => {
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

export const Pager: React.FC<Props> = ({ take, setSkip }) => {
  const router = useRouter();
  const [{ page }, dispatch] = useReducer(PageReducer, {
    page: getPageFromQuery(router.query),
  });
  useEffect(() => {
    setSkip((page - 1) * take);
    const query = buildFilterParams({
      ...router.query,
      page,
    });
    router.push({ query });
  }, [page]);

  useEffect(() => {
    const paramPage = getPageFromQuery(router.query);
    dispatch({ type: "set", payload: paramPage });
  }, [router.query]);

  return (
    <Box w="100%" display="flex" marginTop="2" justifyContent="center">
      <Breadcrumb separator="" fontWeight="medium" fontSize="lg">
        <BreadcrumbItem>
          <BreadcrumbLink
            onClick={() => dispatch({ type: "start" })}
            textDecor="underline"
            marginRight="-4"
          >
            <ChevronLeftIcon />
            <ChevronLeftIcon marginLeft="-2.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => dispatch({ type: "dec" })}>
            <ChevronLeftIcon />
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage={true}>
          <BreadcrumbLink>
            <h3>{page}</h3>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink onClick={() => dispatch({ type: "inc" })}>
            <ChevronRightIcon />
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};
