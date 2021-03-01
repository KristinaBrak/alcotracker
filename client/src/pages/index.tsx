import React, { useState } from "react";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  Sort,
  SortableField,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Center } from "@chakra-ui/react";

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
    <Box padding="3">
      <Box d="flex">
        <Box minW="20%" marginRight="4">
          <Filter setFilter={setFilter} filter={filter} />
        </Box>
        <ProductList productsData={data} loading={loading} error={error} />
      </Box>
    </Box>
  );
};

export default Home;
