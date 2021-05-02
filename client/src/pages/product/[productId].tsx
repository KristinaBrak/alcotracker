import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link as UiLink,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import LineChart from "../../components/Chart/LineChart";
import { categoryNames } from "../../components/Filter/Filter";
import Loader from "../../components/Loader/Loader";
import { useProductQuery } from "../../generated/graphql";
import { authenticate } from "../../utils/ssr-authenticate";

const timestampToDate = (timestamp: string) => {
  const date = new Date(Number(timestamp));
  const parsedDate = `${(date.getMonth() + 1).toLocaleString("lt-LT", {
    minimumIntegerDigits: 2,
  })}/${date.getDate().toLocaleString("lt-LT", { minimumIntegerDigits: 2 })}`;
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

  const graphOptions = {
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return "$" + value;
          },
        },
      },
    },
  };

  const graphData = {
    options: graphOptions,
    labels: data.product.prices
      // .filter((_, idx) => idx % 10 === 0)
      .map(({ createdAt }) => timestampToDate(createdAt)),
    datasets: [
      {
        fill: false,
        lineTension: 0,
        label: "Kaina",
        // backgroundColor: "rgba(75,192,192,0.4)",
        backgroundColor: "blue",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 3,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 3,
        data: data.product.prices.map(({ value }) => value),
      },
    ],
  };

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
                    <strong>{priceMode.toFixed(2)} €</strong>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Kaina</Td>
                  <Td isNumeric>
                    <strong>{priceCurrent.toFixed(2)} €</strong>
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
          <Box marginTop="3">
            <LineChart
              labels={prices.map(({ createdAt }) => timestampToDate(createdAt))}
              data={prices.map(({ value }) => value)}
            />
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};

export const getServerSideProps = authenticate;

export default Product;
