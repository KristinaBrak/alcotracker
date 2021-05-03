import { Box, Flex, Heading, Image, Tag, Text } from "@chakra-ui/react";
import React from "react";
import { ProductDto } from "../../../generated/graphql";
import { categoryNames } from "../../Filter/Filter";
import Discount from "./Discount";
import Link from "next/link";

interface Props {
  product: ProductDto;
}

const ProductItem: React.FC<Props> = ({
  product: { id, name, image, priceCurrent, discount, store, category, volume },
}) => {
  return (
    <Box
      flexGrow={1}
      minW={{ base: "120px", sm: "146px", md: "156px", xl: "170px" }}
      w="100%"
      h="300px"
      maxH="300px"
      borderWidth="1px"
      borderRadius="md"
    >
      <Link href={`/product/${id}`}>
        <a>
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
                {priceCurrent.toFixed(2)} €
              </Heading>
              <Tag colorScheme="orange">{store}</Tag>
            </Box>
            <Discount discount={discount} />
            <Flex marginTop="1" justify="space-between" align="baseline">
              <Tag size="sm">{categoryNames[category]}</Tag>
              {volume ? <Text fontSize="xs">{volume} L</Text> : null}
            </Flex>
          </Box>
        </a>
      </Link>
    </Box>
  );
};

export default ProductItem;
