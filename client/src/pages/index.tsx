import React, { useState } from "react";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  ProductSort,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Flex, Grid } from "@chakra-ui/react";
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
    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "1fr 2fr 1fr" }}>
      <Box
        marginLeft={{ base: "0", md: "3" }}
        marginBottom="3"
        marginTop="2px"
        minW={{ base: "100%", md: "240px" }}
        maxW="240px"
      >
        <Filter setFilter={setFilter} filter={filter} loading={loading} />
      </Box>
      <Flex direction="column">
        <Box w="300px" marginLeft="3" marginBottom="3">
          <SortField setSort={setSort} />
        </Box>
        <Box margin="3" marginTop="0">
          <ProductList productsData={data} loading={loading} error={error} />
        </Box>
      </Flex>
    </Grid>
  );
};

export const getServerSideProps = authenticate;

export default Home;
