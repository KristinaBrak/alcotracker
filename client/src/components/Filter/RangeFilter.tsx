import { Flex, NumberInput, NumberInputField } from "@chakra-ui/react";
import React from "react";

interface Props {
  step?: number;
  minValue: string;
  maxValue: string;
  setMinValue: (value: string) => void;
  setMaxValue: (value: string) => void;
}

const RangeFilter: React.FC<Props> = ({
  step,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue,
}) => {
  return (
    <Flex>
      <NumberInput
        onChange={(valueString) => setMinValue(valueString)}
        value={minValue}
        step={step}
      >
        <NumberInputField />
      </NumberInput>
      <NumberInput
        onChange={(valueString) => setMaxValue(valueString)}
        value={maxValue}
        step={step}
      >
        <NumberInputField />
      </NumberInput>
    </Flex>
  );
};
export default RangeFilter;
