import { Box } from "@chakra-ui/react";
import React from "react";

const MainContent: React.FC = ({ children }) => {
  return (
    <Box marginTop="3" marginBottom="3">
      {children}
    </Box>
  );
};

export default MainContent;
