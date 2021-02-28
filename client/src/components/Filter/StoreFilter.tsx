import React from "react";
import { Select } from "@chakra-ui/react";

interface Props {
  setStore: (store: string) => void;
}

const storeNames = ["barbora", "rimi", "bottlery", "lidl", "vynoteka"];

const StoreFilter: React.FC<Props> = ({ setStore }) => {
  return (
    <Select
      name="categories"
      id="filter-category"
      size="sm"
      onChange={(event) => {
        const name = event.target.value;
        setStore(name);
      }}
    >
      <option value={""}>visi</option>
      {storeNames.map((store) => (
        <option value={store}>{store}</option>
      ))}
    </Select>
  );
};

export default StoreFilter;
