import React, { useState } from "react";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  Sort,
  SortableField,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Center, Flex } from "@chakra-ui/react";
import Layout from "../components/Layout/Layout";

const Home = () => {
  const [value, setValue] = useState(80);
  const [take, setTake] = useState(value);
  const [filter, setFilter] = useState<ProductDtoFilter>({});

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter: filter,
      take: take,
      sort: [{ field: SortableField.Discount, order: Sort.Desc }],
    },
  });

  return (
    <Layout>
      <Flex direction={{ md: "row", base: "column" }} justify="flex-start">
        <Box minW={{ base: "100%", md: "200px" }} w="300px">
          <Filter setFilter={setFilter} filter={filter} />
        </Box>
        <Center margin="3">
          <ProductList productsData={data} loading={loading} error={error} />
        </Center>
        <Box />
        {/* <Sidebar /> */}
      </Flex>
    </Layout>
  );
};

export default Home;
