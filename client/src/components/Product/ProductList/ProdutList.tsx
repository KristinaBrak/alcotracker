import { Center, Heading, SimpleGrid } from "@chakra-ui/react";
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
    <SimpleGrid columns={{ base: 2, sm: 3, md: 3, lg: 4, xl: 6 }} spacing="3">
      {products.map((product) => (
        <ProductItem product={product as ProductDto} key={`${product.id}`} />
      ))}
    </SimpleGrid>
  );
};

export default ProductList;
