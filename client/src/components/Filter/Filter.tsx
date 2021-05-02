import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";
import CategoryFilter from "./CategoryFilter";
import NameFilter from "./NameFilter";
import { Button, Container } from "@chakra-ui/react";
import FilterCard from "./FilterCard";
import StoreFilter from "./StoreFilter";
import RangeFilter from "./RangeFilter";
import { useRouter } from "next/router";
import { buildFilterParams } from "../../utils/filter";

interface FilterProps {
  setFilter: Dispatch<SetStateAction<ProductDtoFilter>>;
  filter: ProductDtoFilter;
  loading?: boolean;
  onSubmit: () => void;
  firstRef?: React.MutableRefObject<undefined>;
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

const Filter: React.FC<FilterProps> = ({
  setFilter,
  filter,
  loading,
  onSubmit,
  firstRef,
}) => {
  const router = useRouter();

  const [name, setName] = useState(filter.name_like);
  const [minDiscount, setMinDiscount] = useState<string | undefined>(
    filter.discount_gte?.toString()
  );
  const [maxDiscount, setMaxDiscount] = useState<string | undefined>(
    filter.discount_lte?.toString()
  );
  const [minPrice, setMinPrice] = useState<string | undefined>(
    filter.priceCurrent_gte?.toString()
  );
  const [maxPrice, setMaxPrice] = useState<string | undefined>(
    filter.priceCurrent_lte?.toString()
  );
  const [category, setCategory] = useState<string | undefined>(
    filter.category_like
  );
  const [minAlcVolume, setMinAlcVolume] = useState<string | undefined>(
    filter.alcVolume_gte?.toString()
  );
  const [maxAlcVolume, setMaxAlcVolume] = useState<string | undefined>(
    filter.alcVolume_lte?.toString()
  );
  const [minVolume, setMinVolume] = useState<string | undefined>(
    filter.volume_gte?.toString()
  );
  const [maxVolume, setMaxVolume] = useState<string | undefined>(
    filter.volume_lte?.toString()
  );
  const [store, setStore] = useState<string | undefined>(filter.store_like);

  const submitFilter = () => {
    const newFilter = {
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
      category_like: category,
      alcVolume_lte: maxAlcVolume ? Number(maxAlcVolume) : undefined,
      alcVolume_gte: minAlcVolume ? Number(minAlcVolume) : undefined,
      volume_lte: maxVolume ? Number(maxVolume) : undefined,
      volume_gte: minVolume ? Number(minVolume) : undefined,
      store_like: store,
    };

    const query = buildFilterParams({
      ...router.query,
      ...newFilter,
    });

    router.push({
      query,
    });

    setFilter(newFilter);
  };

  return (
    <Container colorScheme="teal" outline="1px solid teal" padding="10px">
      <form
        onSubmit={(event) => {
          event.preventDefault();

          submitFilter();
          onSubmit();
        }}
      >
        <FilterCard text="Pavadinimas">
          <NameFilter name={name} setName={setName} firstRef={firstRef} />
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
          <CategoryFilter
            defaultValue={filter.category_like}
            setCategory={setCategory}
          />
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
        <FilterCard text="Kiekis">
          <RangeFilter
            step={0.1}
            minValue={minVolume}
            maxValue={maxVolume}
            setMinValue={setMinVolume}
            setMaxValue={setMaxVolume}
          />
        </FilterCard>
        <FilterCard text="Parduotuvė">
          <StoreFilter defaultValue={filter.store_like} setStore={setStore} />
        </FilterCard>
        <Container maxWidth="100%">
          <Button
            isLoading={loading}
            type="submit"
            size="sm"
            colorScheme="teal"
            width="100%"
          >
            {loading ? "Ieškoma..." : "Ieškoti"}
          </Button>
        </Container>
      </form>
    </Container>
  );
};

export default Filter;
