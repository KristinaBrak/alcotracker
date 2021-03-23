import { Box, Center, Tooltip } from "@chakra-ui/react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Center
      as="footer"
      bg="teal.500"
      h="50px"
      // w="100%"
      marginTop="auto"
      color="white"
    >
      <Tooltip label="O ką tu galvoji" fontSize="md">
        @NenaudingaInformacija
      </Tooltip>
    </Center>
  );
};

export default Footer;
