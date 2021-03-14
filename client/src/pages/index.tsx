import React, { useState } from "react";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  ProductSort,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Flex } from "@chakra-ui/react";
import SortField from "../components/Sort/SortField";
import { useRouter } from "next/router";
import { parseSortQuery } from "../utils/sort";
import { authenticate } from "../utils/ssr-authenticate";
import { parseFilterQuery } from "../utils/filter";

const Home = () => {
  const [value, setValue] = useState(80);
  const [take, setTake] = useState(value);
  const router = useRouter();

  const [filter, setFilter] = useState<ProductDtoFilter>(
    parseFilterQuery(router.query)
  );

  const [sort, setSort] = useState<ProductSort[]>(
    parseSortQuery(router.query.sort)
  );

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter,
      take,
      sort,
    },
  });

  return (
    <Flex direction={{ md: "row", base: "column" }} justify="space-between">
      <Box
        marginLeft="3"
        marginBottom="3"
        marginTop="2px"
        minW={{ base: "100%", md: "240px" }}
        maxW="240px"
      >
        <Filter setFilter={setFilter} filter={filter} loading={loading} />
      </Box>
      <Flex direction="column" align="flex-start" width="100%">
        <Box w="300px" marginLeft="3" marginBottom="3">
          <SortField setSort={setSort} />
        </Box>
        <Box margin="3" marginTop="0" w="100%">
          <ProductList productsData={data} loading={loading} error={error} />
        </Box>
      </Flex>
      <Box minW={{ lg: "200px" }} />
    </Flex>
  );
};

export const getServerSideProps = authenticate;

export default Home;
