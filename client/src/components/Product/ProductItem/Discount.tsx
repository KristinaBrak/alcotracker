import React from "react";
import { StatHelpText, StatArrow, Stat } from "@chakra-ui/react";

interface Props {
  discount: number;
}
const Discount: React.FC<Props> = ({ discount }) => {
  return (
    <Stat>
      {discount > 0 ? (
        <StatHelpText>
          <StatArrow type="decrease" />
          {(discount * 100).toFixed(0)} %
        </StatHelpText>
      ) : null}
      {discount < 0 ? (
        <StatHelpText>
          <StatArrow type="increase" />
          {(discount * -100).toFixed(0)} %
        </StatHelpText>
      ) : null}
    </Stat>
  );
};

export default Discount;
