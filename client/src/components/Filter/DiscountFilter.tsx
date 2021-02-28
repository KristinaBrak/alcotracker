import React from "react";
import { Input, Flex } from "@chakra-ui/react";

interface Props {
  minValue: number;
  maxValue: number;
  setMinValue: React.Dispatch<React.SetStateAction<number>>;
  setMaxValue: React.Dispatch<React.SetStateAction<number>>;
}

const DiscountFilter: React.FC<Props> = ({
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
}) => {
  return (
    <Flex>
      <Input
        type="number"
        id="price-min"
        onChange={({ target }) => setMinValue(Number(target.value))}
        placeholder="min"
        size="sm"
        value={minValue}
      />
      <Input
        type="number"
        id="price-max"
        onChange={({ target }) => setMaxValue(Number(target.value))}
        placeholder="max"
        size="sm"
        value={maxValue}
      />
    </Flex>
  );
};

export default DiscountFilter;
