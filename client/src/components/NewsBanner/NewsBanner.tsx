import { BellIcon, StarIcon } from "@chakra-ui/icons";
import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { updateNewsInfo } from "../../utils/newsInfo";

const NewsBanner: React.FC = () => {
  return (
    <Box
      w="100%"
      h="50px"
      marginBottom="5"
      backgroundColor="yellow.200"
      onClick={updateNewsInfo}
    >
      <Link href="/news">
        <a>
          <Flex justify="center" alignItems="center" h="100%">
            <StarIcon w="4" h="4" marginRight="3" />
            <Text size="md">Užpylimo atnaujinimai</Text>
          </Flex>
        </a>
      </Link>
    </Box>
  );
};

export default NewsBanner;
