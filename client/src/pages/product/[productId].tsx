import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link as UiLink,
  ListItem,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tr,
  UnorderedList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { categoryNames } from "../../components/Filter/Filter";
import Loader from "../../components/Loader/Loader";
import { useProductQuery } from "../../generated/graphql";
import { authenticate } from "../../utils/ssr-authenticate";

const timestampToDate = (timestamp: string) => {
  const date = new Date(Number(timestamp));
  const parsedDate = `${date.getFullYear()} / ${(
    date.getMonth() + 1
  ).toLocaleString("lt-LT", {
    minimumIntegerDigits: 2,
  })} / ${date.getDate().toLocaleString("lt-LT", { minimumIntegerDigits: 2 })}`;
  return parsedDate;
};

export const Product = () => {
  const router = useRouter();
  const { productId } = router.query;
  const parsedProductId = Number(
    typeof productId === "string" ? productId : productId[0]
  );

  const { error, loading, data } = useProductQuery({
    variables: {
      id: parsedProductId,
    },
  });

  if (error) {
    return <p>error</p>;
  }
  if (loading || !data) {
    return <Loader />;
  }

  const {
    product: {
      name,
      link,
      volume,
      alcVolume,
      priceMode,
      priceCurrent,
      prices,
      discount,
      category,
      image,
      store,
    },
  } = data;

  return (
    <Center marginTop="3">
      <Box borderWidth="1px" borderRadius="lg" padding="8">
        <Flex direction="column">
          <Center>
            <Heading as="h4" size="md" marginBottom="8">
              {name}
            </Heading>
          </Center>
          <Flex direction={{ base: "column", md: "row" }} alignItems="center">
            <Center>
              <Image
                width="300px"
                height="auto"
                maxH="300px"
                objectFit="scale-down"
                src={image}
                alt={name}
              />
            </Center>
            <Table
              size="sm"
              variant="striped"
              colorScheme="gray"
              maxW={{ md: "300px" }}
            >
              <Tbody>
                <Tr>
                  <Td>Parduotuvė</Td>
                  <Td isNumeric>
                    <strong>{store.toUpperCase()}</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Kategorija</Td>
                  <Td isNumeric>
                    <strong>{categoryNames[category]}</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Įprasta kaina</Td>
                  <Td isNumeric>
                    <strong>{priceMode} €</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Kaina</Td>
                  <Td isNumeric>
                    <strong>{priceCurrent} €</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nuolaida</Td>
                  <Td isNumeric>
                    <strong>
                      {discount ? `${(discount * 100).toFixed(0)} %` : null}
                    </strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Tūris</Td>
                  <Td isNumeric>
                    <strong>{volume ? `${volume} L` : null}</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Stiprumas</Td>
                  <Td isNumeric>
                    <strong>{alcVolume ? `${alcVolume} %` : null}</strong>
                  </Td>
                </Tr>
              </Tbody>
              <TableCaption>
                <UiLink
                  href={link}
                  isExternal
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    type="submit"
                    size="sm"
                    colorScheme="teal"
                    width="100%"
                  >
                    Eiti į parduotuvę
                  </Button>
                </UiLink>
              </TableCaption>
            </Table>
          </Flex>
          <UnorderedList marginTop="5">
            {prices.map(({ value, createdAt }) => (
              <ListItem
                key={createdAt}
                display="flex"
                justifyContent="space-around"
              >
                <Box>{timestampToDate(createdAt)}</Box>
                <Box>{value.toFixed(2)} €</Box>
              </ListItem>
            ))}
          </UnorderedList>
        </Flex>
      </Box>
    </Center>
  );
};

export const getServerSideProps = authenticate;

export default Product;
