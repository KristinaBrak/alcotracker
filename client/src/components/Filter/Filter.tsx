import { Select } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";

interface Props {
  setFilter: Dispatch<SetStateAction<ProductDtoFilter>>;
  filter: ProductDtoFilter;
}

enum Category {
  WINE = "wine",
  STRONG = "strong",
  LIGHT = "light",
  FREE = "free",
  OTHER = "other",
}
const categoryNames: { [key: string]: string } = {
  [Category.WINE]: "vynas",
  [Category.STRONG]: "stiprieji",
  [Category.LIGHT]: "lengvieji",
  [Category.FREE]: "nealkoholiniai",
  [Category.OTHER]: "kiti",
};

const Filter: React.FC<Props> = ({ setFilter, filter }) => {
  const [name, setName] = useState("");
  const [minValue, setMinValue] = useState<number | undefined>();
  const [maxValue, setMaxValue] = useState<number | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  const submitFilter = () => {
    setFilter({
      ...filter,
      name_like: name,
      priceCurrent_lte: maxValue,
      priceCurrent_gte: minValue,
      priceMode_lte: maxValue,
      priceMode_gte: minValue,
      category_like: category,
    });
  };

  return (
    <form
      style={{ margin: "10px", padding: "10px" }}
      onSubmit={(event) => {
        event.preventDefault();
        submitFilter();
      }}
    >
      <div id="filter-name">
        <input
          type="text"
          value={name}
          onChange={({ target }) => {
            setName(target.value);
          }}
          style={{ border: "1px solid black" }}
          placeholder="Enter name"
        />
      </div>
      <div id="filter-price">
        <input
          type="number"
          id="price-min"
          onChange={({ target }) => setMinValue(Number(target.value))}
          placeholder="MIN"
          style={{ border: "1px solid green", width: "50%" }}
          value={minValue}
        />
        <input
          type="number"
          id="price-max"
          onChange={({ target }) => setMaxValue(Number(target.value))}
          style={{ border: "1px solid green", width: "50%" }}
          placeholder="MAX"
          value={maxValue}
        />
      </div>

      <Select
        name="categories"
        id="filter-category"
        onChange={(event) => {
          const name = event.target.value;
          setCategory(name);
        }}
      >
        <option value={Category.WINE}>{categoryNames[Category.WINE]}</option>
        <option value={Category.STRONG}>
          {categoryNames[Category.STRONG]}
        </option>
        <option value={Category.LIGHT}>{categoryNames[Category.LIGHT]}</option>
        <option value={Category.FREE}>{categoryNames[Category.FREE]}</option>
        <option value={Category.OTHER}>{categoryNames[Category.OTHER]}</option>
      </Select>
      <button type="submit">Search</button>
    </form>
  );
};

export default Filter;
