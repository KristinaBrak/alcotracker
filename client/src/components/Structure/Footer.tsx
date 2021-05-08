import { Box, Center, Link, Tooltip } from "@chakra-ui/react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <Center as="footer" bg="teal.500" h="50px" marginTop="auto" color="white">
      <Link href="/news">
        <Tooltip label="O ką tu galvoji" fontSize="md">
          @NenaudingaInformacija
        </Tooltip>
      </Link>
    </Center>
  );
};

export default Footer;
