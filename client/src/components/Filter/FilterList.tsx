import React, { Dispatch, SetStateAction, useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";
import CategoryFilter from "./CategoryFilter";
import NameFilter from "./NameFilter";
import PriceFilter from "./PriceFilter";

interface Props {
  setFilter: Dispatch<SetStateAction<ProductDtoFilter>>;
  filter: ProductDtoFilter;
}

const FilterList: React.FC<Props> = ({ setFilter, filter }) => {
  const handleCategoryChange = (category: string) => {
    setFilter({ ...filter, category_like: category });
  };
  const handleNameChange = (name: string) => {
    setFilter({ ...filter, name_like: name });
  };
  const handlePriceChange = (priceMin: number, priceMax?: number) => {
    setFilter({
      ...filter,
      priceCurrent_lte: priceMax,
      priceCurrent_gte: priceMin,
      priceCurrent_eq: priceMax,
      priceMode_lte: priceMax,
      priceMode_gte: priceMin,
      priceMode_eq: priceMax,
    });
  };
  return (
    <div style={{ margin: "10px", display: "flex", flexDirection: "column" }}>
      <CategoryFilter setCategory={handleCategoryChange} />
      <NameFilter setName={handleNameChange} />
      {/* <PriceFilter setPrice={handlePriceChange} /> */}
    </div>
  );
};

export default FilterList;
