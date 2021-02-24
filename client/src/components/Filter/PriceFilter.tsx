import React, { useState } from "react";

interface Props {
  setPrice: (priceMin: number, priceMax?: number) => void;
}

const PriceFilter: React.FC<Props> = ({ setPrice }) => {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number | undefined>();
  return (
    <div>
      <input
        type="text"
        id="price-min"
        onChange={({ target }) => setMinValue(Number(target.value))}
        style={{ border: "1px solid green" }}
      />
      <input
        type="text"
        id="price-max"
        onChange={({ target }) => setMaxValue(Number(target.value))}
        style={{ border: "1px solid green" }}
      />
      <button onClick={() => setPrice(minValue, maxValue)}>Apply</button>
    </div>
  );
};

export default PriceFilter;
