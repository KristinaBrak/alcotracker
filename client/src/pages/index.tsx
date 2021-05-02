import { HamburgerIcon } from "@chakra-ui/icons";
import { Box, Flex, Grid, IconButton, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FilterDrawer from "../components/Drawer/FilterDrawer";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import SortField from "../components/Sort/SortField";
import {
  ProductDtoFilter,
  ProductSort,
  useProductsQuery,
} from "../generated/graphql";
import { parseFilterQuery } from "../utils/filter";
import { parseSortQuery } from "../utils/sort";
import { authenticate } from "../utils/ssr-authenticate";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "1fr 2fr 1fr" }}>
      <FilterDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <Box marginBottom="3" marginTop="2px" w="100%">
          <Filter
            setFilter={setFilter}
            filter={filter}
            loading={loading}
            onSubmit={onClose}
          />
        </Box>
      </FilterDrawer>
      <Box
        marginLeft={{ base: "0", md: "3" }}
        marginBottom="3"
        marginTop="2px"
        minW={{ base: "100%", md: "240px" }}
        maxW="240px"
        w="100%"
        display={{ base: "none", md: "block" }}
      >
        <Filter
          setFilter={setFilter}
          filter={filter}
          loading={loading}
          onSubmit={onClose}
        />
      </Box>
      <Flex direction="column">
        <Flex
          marginLeft="3"
          marginRight="3"
          marginBottom="3"
          justifyContent="space-between"
        >
          <Box display={{ base: "visible", md: "none" }}>
            <IconButton
              aria-label="Filtruoti"
              size="md"
              onClick={onOpen}
              icon={<HamburgerIcon />}
            />
          </Box>
          <SortField setSort={setSort} />
        </Flex>
        <Box margin="3" marginTop="0">
          <ProductList productsData={data} loading={loading} error={error} />
        </Box>
      </Flex>
    </Grid>
  );
};

export const getServerSideProps = authenticate;

export default Home;
