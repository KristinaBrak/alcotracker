import { Box, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ProductSort, SortableField } from "../../generated/graphql";

interface Props {
  setSort: React.Dispatch<React.SetStateAction<ProductSort[]>>;
}

const DEFAULT_SORT = "discount.desc";

const parseSortQuery = (sort: string | string[]): ProductSort[] => {
  const sortQuery = typeof sort === "string" ? sort : null;
  const sortEntries = sortQuery ? sortQuery.split(",") : [DEFAULT_SORT];

  return sortEntries.reduce<ProductSort[]>((acc, sortEntry) => {
    const [field, order] = sortEntry.split(".");
    const isValidField = Object.values(SortableField).some(
      (sf) => sf.toLowerCase() === field.toLowerCase()
    );

    return isValidField
      ? [...acc, { field, order: order.toUpperCase() } as ProductSort]
      : acc;
  }, []);
};

const SortField: React.FC<Props> = ({ setSort }) => {
  const router = useRouter();
  const { sort } = router.query;

  useEffect(() => {
    const result = parseSortQuery(sort);
    setSort(result);
  }, [router.query]);

  const onSortChange = (value: string) => {
    router.push({ query: { ...router.query, sort: value } });
  };

  return (
    <Box>
      <Select
        placeholder="Rikiuoti"
        defaultValue="discount.desc"
        onChange={({ target: { value } }) => onSortChange(value)}
      >
        <option value="discount.desc">Didžiausia nuolaida</option>
        <option value="discount.asc">Dižiausias pabrangimas</option>

        <option value="priceCurrent.desc">Nuo brangiausio iki pigiausio</option>
        <option value="priceCurrent.asc">Nuo pigiausio iki brangiausio</option>

        <option value="alcVolume.desc">Stipriausi</option>
        <option value="volume.desc">Didžiausias tūris</option>
        <option value="volume.asc">Mažiausias tūris</option>
      </Select>
    </Box>
  );
};
export default SortField;
