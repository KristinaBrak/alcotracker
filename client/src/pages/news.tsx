import {
  Box,
  Text,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  UnorderedList,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { news } from "../lib/news";
import { authenticate } from "../utils/ssr-authenticate";

const News: React.FC = () => {
  return (
    <Center>
      <Flex direction="column">
        <Heading size="lg" textAlign="center" marginBottom="2">
          Naujienos
        </Heading>
        <List>
          {news.map(({ date, content }) => (
            <ListItem>
              <Box
                maxW="md"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                padding="8"
                marginBottom={3}
              >
                <Heading size="sm" marginBottom="1">
                  {date}
                </Heading>
                <UnorderedList marginLeft="10">
                  {content.map((contentItem) => (
                    <ListItem>{contentItem}</ListItem>
                  ))}
                </UnorderedList>
              </Box>
            </ListItem>
          ))}
        </List>
      </Flex>
    </Center>
  );
};

export const getServerSideProps = authenticate;
export default News;
