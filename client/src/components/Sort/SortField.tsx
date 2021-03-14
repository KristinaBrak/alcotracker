import { Box, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { ProductSort } from "../../generated/graphql";
import { DEFAULT_SORT, parseSortQuery } from "../../utils/sort";

interface Props {
  setSort: React.Dispatch<React.SetStateAction<ProductSort[]>>;
}

const SortField: React.FC<Props> = ({ setSort }) => {
  const router = useRouter();

  const onSortChange = (value: string) => {
    const result = parseSortQuery(value);
    setSort(result);
    router.push({ query: { ...router.query, sort: value } });
  };

  return (
    <Box>
      <Select
        defaultValue={router.query.sort || DEFAULT_SORT}
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
