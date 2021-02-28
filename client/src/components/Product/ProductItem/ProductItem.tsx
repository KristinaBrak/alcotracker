import {
  Box,
  Heading,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { ProductDto } from "../../../generated/graphql";
import { categoryNames } from "../../Filter/Filter";
import Discount from "./Discount";

interface Props {
  product: ProductDto;
}

const ProductItem: React.FC<Props> = ({
  product: { name, image, link, priceCurrent, discount, store, category },
}) => {
  return (
    <Box
      w="200px"
      h="300px"
      maxH="300px"
      borderWidth="1px"
      borderRadius="lg"
      // overflow="hidden"
      margin="2"
    >
      <a href={link} target="_blank">
        <Image
          width="100%"
          height="150px"
          objectFit="scale-down"
          src={image}
          alt={name}
          loading="lazy"
        />
      </a>

      <Box
        padding="2"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignSelf="stretch"
      >
        <Text fontSize="sm" noOfLines={2}>
          {name}
        </Text>
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
        {discount !== 0 ? <Discount discount={discount} /> : null}
        <Box marginTop="1">
          <Tag>{categoryNames[category]}</Tag>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductItem;
