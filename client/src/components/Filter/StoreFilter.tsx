import React from "react";
import { Select } from "@chakra-ui/react";

interface Props {
  defaultValue?: string;
  setStore: (store: string) => void;
}

const storeNames = ["barbora", "rimi", "bottlery", "lidl", "iki"];

const StoreFilter: React.FC<Props> = ({ defaultValue, setStore }) => {
  return (
    <Select
      name="categories"
      id="filter-category"
      size="sm"
      defaultValue={defaultValue}
      onChange={(event) => {
        const name = event.target.value;
        setStore(name);
      }}
    >
      <option value={""}>visi</option>
      {storeNames.map((store) => (
        <option key={store} value={store}>
          {store}
        </option>
      ))}
    </Select>
  );
};

export default StoreFilter;
