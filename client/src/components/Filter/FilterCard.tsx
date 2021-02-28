import { Container, Text } from "@chakra-ui/react";
import React, { Component, ReactElement } from "react";

interface Props {
  text: string;
  children: any;
}

const FilterCard: React.FC<Props> = ({ text, children }) => {
  return (
    <Container paddingBottom="10px" marginBottom="5px">
      <Text fontSize="sm" marginBottom="5px">
        {text}:
      </Text>
      {children}
    </Container>
  );
};

export default FilterCard;
