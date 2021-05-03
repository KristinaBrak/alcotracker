import { Box, Center, Flex, Grid, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { ProductDto, ProductsQuery } from "../../../generated/graphql";
import Loader from "../../Loader/Loader";
import ProductItem from "../ProductItem/ProductItem";

interface Props {
  productsData: ProductsQuery;
  loading: boolean;
  error?: Error;
}

const ProductList: React.FC<Props> = ({ productsData, loading, error }) => {
  if (error) {
    return <p>error</p>;
  }
  if (loading || !productsData) {
    return <Loader />;
  }

  const { products } = productsData;
  if (!products.length) {
    return (
      <Center marginTop="20%">
        <Heading as="h4" size="sm">
          Rezultatų nėra
        </Heading>
      </Center>
    );
  }
  return (
    <Grid
      templateColumns={{
        base: "repeat(2, 1fr)",
        sm: "repeat(3, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
        xl: "repeat(5, 1fr)",
      }}
      gridGap={{ base: 2, sm: 2, md: 3 }}
    >
      {products.map((product) => (
        <ProductItem product={product as ProductDto} key={`${product.id}`} />
      ))}
    </Grid>
  );
};

export default ProductList;
