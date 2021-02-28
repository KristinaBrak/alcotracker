import { Box, Heading, Image, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { ProductDto } from "../../../generated/graphql";
import { categoryNames } from "../../Filter/Filter";
import Discount from "./Discount";

interface Props {
  product: ProductDto;
}

const ProductItem: React.FC<Props> = ({
  product: {
    name,
    image,
    link,
    priceMode,
    priceCurrent,
    discount,
    store,
    category,
  },
}) => {
  return (
    <a href={link} target="_blank">
      <Box
        w="200px"
        h="300px"
        maxH="300px"
        borderWidth="1px"
        borderRadius="md"
        margin="2"
      >
        <Image
          width="100%"
          height="150px"
          objectFit="scale-down"
          src={image}
          alt={name}
          loading="lazy"
        />

        <Box
          padding="2"
          display="flex"
          minH="150px"
          flexDirection="column"
          justifyContent="space-between"
          alignSelf="stretch"
        >
          <Box minH="40px">
            <Text fontSize="sm" noOfLines={2}>
              {name}
            </Text>
          </Box>
          <Box
            marginTop="2"
            d="flex"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Heading as="h5" size="sm">
              {priceCurrent}€
            </Heading>
            <Tag colorScheme="pink">{store}</Tag>
          </Box>
          <Discount discount={discount} />
          <Box marginTop="1">
            <Tag>{categoryNames[category]}</Tag>
          </Box>
        </Box>
      </Box>
    </a>
  );
};

export default ProductItem;
