import {
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
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
        allowMouseWheel
        onChange={(valueString) => setMinValue(valueString)}
        value={minValue}
        step={step}
        size="sm"
      >
        <NumberInputField placeholder="nuo" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <NumberInput
        allowMouseWheel
        onChange={(valueString) => setMaxValue(valueString)}
        value={maxValue}
        step={step}
        size="sm"
      >
        <NumberInputField placeholder="iki" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Flex>
  );
};
export default RangeFilter;
