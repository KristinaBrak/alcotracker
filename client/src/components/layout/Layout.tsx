import { Flex } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";

const Layout = ({ children }) => {
  return (
    <Flex direction="column">
      <Header />
      <MainContent>{children}</MainContent>
      {/* <Footer /> */}
    </Flex>
  );
};

export default Layout;
