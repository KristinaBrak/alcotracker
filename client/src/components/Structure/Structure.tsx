import { Flex } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";

const Structure: React.FC = ({ children }) => {
  return (
    <Flex direction="column">
      <Header />
      <MainContent>{children}</MainContent>
    </Flex>
  );
};

export default Structure;
