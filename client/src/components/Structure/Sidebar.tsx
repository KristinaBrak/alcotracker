import { Box, Center, Flex } from "@chakra-ui/react";
import React from "react";

const Sidebar: React.FC = () => {
  return (
    <Flex minW="300px" direction="column" bgColor="tomato">
      <Center>Čia gali būti jūsų reklama</Center>
    </Flex>
  );
};

export default Sidebar;
