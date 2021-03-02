import { Select } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";
import CategoryFilter from "./CategoryFilter";
import NameFilter from "./NameFilter";
import { Button, Container } from "@chakra-ui/react";
import FilterCard from "./FilterCard";
import StoreFilter from "./StoreFilter";
import RangeFilter from "./RangeFilter";

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
export const categoryNames: { [key: string]: string } = {
  [Category.WINE]: "vynas",
  [Category.STRONG]: "stiprieji",
  [Category.LIGHT]: "lengvieji",
  [Category.FREE]: "nealkoholiniai",
  [Category.OTHER]: "kiti",
};

const Filter: React.FC<Props> = ({ setFilter, filter }) => {
  const [name, setName] = useState("");
  const [minDiscount, setMinDiscount] = useState<string | undefined>();
  const [maxDiscount, setMaxDiscount] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [minAlcVolume, setMinAlcVolume] = useState<string | undefined>();
  const [maxAlcVolume, setMaxAlcVolume] = useState<string | undefined>();
  const [minVolume, setMinVolume] = useState<number | undefined>();
  const [maxVolume, setMaxVolume] = useState<number | undefined>();
  const [store, setStore] = useState<string | undefined>();

  const submitFilter = () => {
    setFilter({
      ...filter,
      name_like: name,
      discount_gte: minDiscount
        ? +(Number(minDiscount) / 100).toFixed(2)
        : undefined,
      discount_lte: maxDiscount
        ? +(Number(maxDiscount) / 100).toFixed(2)
        : undefined,
      priceCurrent_lte: maxPrice ? Number(maxPrice) : undefined,
      priceCurrent_gte: minPrice ? Number(minPrice) : undefined,
      priceMode_lte: maxPrice ? Number(maxPrice) : undefined,
      priceMode_gte: minPrice ? Number(minPrice) : undefined,
      category_like: category,
      alcVolume_lte: maxAlcVolume ? Number(maxAlcVolume) : undefined,
      alcVolume_gte: minAlcVolume ? Number(minAlcVolume) : undefined,
      volume_lte: maxVolume,
      volume_gte: minVolume,
      store_like: store,
    });
  };

  return (
    <Container
      colorScheme="teal"
      outline="1px solid teal"
      margin="10px"
      padding="10px"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitFilter();
        }}
      >
        <FilterCard text="Pavadinimas">
          <NameFilter name={name} setName={setName} />
        </FilterCard>
        <FilterCard text="Nuolaida">
          <RangeFilter
            minValue={minDiscount}
            maxValue={maxDiscount}
            setMinValue={setMinDiscount}
            setMaxValue={setMaxDiscount}
          />
        </FilterCard>
        <FilterCard text="Kainos rėžiai">
          <RangeFilter
            minValue={minPrice}
            maxValue={maxPrice}
            setMinValue={setMinPrice}
            setMaxValue={setMaxPrice}
          />
        </FilterCard>
        <FilterCard text="Kategorija">
          <CategoryFilter setCategory={setCategory} />
        </FilterCard>
        <FilterCard text="Stiprumas">
          <RangeFilter
            step={0.5}
            minValue={minAlcVolume}
            maxValue={maxAlcVolume}
            setMinValue={setMinAlcVolume}
            setMaxValue={setMaxAlcVolume}
          />
        </FilterCard>
        {/* <FilterCard text="Kiekis">
          <RangeFilter
            minValue={minVolume}
            maxValue={maxVolume}
            setMinValue={setMinVolume}
            setMaxValue={setMaxVolume}
          />
        </FilterCard> */}
        <FilterCard text="Parduotuvė">
          <StoreFilter setStore={setStore} />
        </FilterCard>
        <Button type="submit" size="sm" colorScheme="teal">
          Search
        </Button>
      </form>
    </Container>
  );
};

export default Filter;
