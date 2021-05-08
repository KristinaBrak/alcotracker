import { Flex, Slide } from "@chakra-ui/react";
import React from "react";
import NewsBanner from "../NewsBanner/NewsBanner";
import Footer from "./Footer";
import Header from "./Header";
import MainContent from "./MainContent";
import MetaInfo from "./MetaInfo";

const Structure: React.FC = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <MetaInfo />
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </Flex>
  );
};

export default Structure;
