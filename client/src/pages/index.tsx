import React, { useEffect, useState } from "react";
import Filter from "../components/Filter/Filter";
import Structure from "../components/Structure/Structure";
import ProductList from "../components/Product/ProductList/ProdutList";
import bcrypt from "bcryptjs";
import {
  ProductDtoFilter,
  ProductSort,
  useProductsQuery,
} from "../generated/graphql";
import { Box, Flex } from "@chakra-ui/react";
import SortField from "../components/Sort/SortField";
import { useRouter } from "next/router";
import { passwordHash } from "./login";

const Home = () => {
  const [value, setValue] = useState(20);
  const [take, setTake] = useState(value);
  const [filter, setFilter] = useState<ProductDtoFilter>({});
  const [sort, setSort] = useState<ProductSort[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter,
      take,
      sort,
    },
  });

  useEffect(() => {
    const localPasswordHash = localStorage.getItem("password-hash");
    if (localPasswordHash !== passwordHash) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      {isAuthenticated && (
        <Flex direction={{ md: "row", base: "column" }} justify="space-between">
          <Box
            marginLeft="3"
            marginBottom="3"
            marginTop="2px"
            minW={{ base: "100%", md: "200px" }}
            w="300px"
          >
            <Filter setFilter={setFilter} filter={filter} loading={loading} />
          </Box>
          <Flex direction="column">
            <Box w="300px">
              <SortField setSort={setSort} />
            </Box>
            <Box margin="3" marginTop="0">
              <ProductList
                productsData={data}
                loading={loading}
                error={error}
              />
            </Box>
          </Flex>
          <Box minW={{ lg: "200px" }} />
        </Flex>
      )}
    </>
  );
};

export default Home;
