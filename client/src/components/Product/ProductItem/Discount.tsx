import React from "react";
import { StatHelpText, StatArrow, Stat } from "@chakra-ui/react";

interface Props {
  discount: number;
}
const Discount: React.FC<Props> = ({ discount }) => {
  return (
    <Stat visibility={discount === 0 ? "hidden" : "visible"}>
      {discount > 0 ? (
        <StatHelpText>
          <StatArrow transform="rotate(180deg)" type="increase" />
          {(discount * 100).toFixed(0)} %
        </StatHelpText>
      ) : null}
      {discount < 0 ? (
        <StatHelpText>
          <StatArrow transform="rotate(180deg)" type="decrease" />
          {(discount * -100).toFixed(0)} %
        </StatHelpText>
      ) : null}
    </Stat>
  );
};

export default Discount;
