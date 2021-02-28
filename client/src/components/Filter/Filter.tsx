import { Select } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";
import CategoryFilter from "./CategoryFilter";
import NameFilter from "./NameFilter";
import PriceFilter from "./PriceFilter";
import { Button, Container } from "@chakra-ui/react";
import FilterCard from "./FilterCard";
import AlcVolumeFilter from "./AlcVolumeFilter";
import VolumeFilter from "./VolumeFilter";
import StoreFilter from "./StoreFilter";
import DiscountFilter from "./DiscountFilter";

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
  const [minDiscount, setMinDiscount] = useState<number | undefined>();
  const [maxDiscount, setMaxDiscount] = useState<number | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [minAlcVolume, setMinAlcVolume] = useState<number | undefined>();
  const [maxAlcVolume, setMaxAlcVolume] = useState<number | undefined>();
  const [minVolume, setMinVolume] = useState<number | undefined>();
  const [maxVolume, setMaxVolume] = useState<number | undefined>();
  const [store, setStore] = useState<string | undefined>();

  const submitFilter = () => {
    setFilter({
      ...filter,
      name_like: name,
      discount_gte: minDiscount,
      discount_lte: maxDiscount,
      priceCurrent_lte: maxPrice,
      priceCurrent_gte: minPrice,
      priceMode_lte: maxPrice,
      priceMode_gte: minPrice,
      category_like: category,
      alcVolume_lte: maxAlcVolume,
      alcVolume_gte: minAlcVolume,
      volume_lte: maxVolume,
      volume_gte: minVolume,
      store_like: store,
    });
  };

  return (
    <Container
      colorScheme="teal"
      outline="1px solid teal"
      id="filter-container"
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
          <DiscountFilter
            minValue={minDiscount}
            maxValue={maxDiscount}
            setMinValue={setMinDiscount}
            setMaxValue={setMaxDiscount}
          />
        </FilterCard>
        <FilterCard text="Kainos rėžiai">
          <PriceFilter
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
          <AlcVolumeFilter
            minValue={minAlcVolume}
            maxValue={maxAlcVolume}
            setMinValue={setMinAlcVolume}
            setMaxValue={setMaxAlcVolume}
          />
        </FilterCard>
        <FilterCard text="Kiekis">
          <VolumeFilter
            minValue={minVolume}
            maxValue={maxVolume}
            setMinValue={setMinVolume}
            setMaxValue={setMaxVolume}
          />
        </FilterCard>
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
