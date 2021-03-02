import React, { useState } from "react";
import Filter from "../components/Filter/Filter";
import Layout from "../components/Layout/Layout";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  Sort,
  SortableField,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Center, Flex } from "@chakra-ui/react";

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
        <Box
          marginLeft="3"
          marginBottom="3"
          marginTop="2px"
          minW={{ base: "100%", md: "200px" }}
          w="300px"
        >
          <Filter setFilter={setFilter} filter={filter} />
        </Box>
        <Center margin="3" marginTop="0">
          <ProductList productsData={data} loading={loading} error={error} />
        </Center>
        <Box />
        {/* <Sidebar /> */}
      </Flex>
    </Layout>
  );
};

export default Home;
