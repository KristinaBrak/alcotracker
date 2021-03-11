import { Flex } from "@chakra-ui/react";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";

const Structure: React.FC = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </Flex>
  );
};

export default Structure;
