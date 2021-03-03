import { Select } from "@chakra-ui/react";
import React from "react";

interface Props {
  setCategory: (category: string) => void;
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

const CategoryFilter: React.FC<Props> = ({ setCategory }) => {
  return (
    <Select
      name="categories"
      id="filter-category"
      size="sm"
      onChange={(event) => {
        const name = event.target.value;
        setCategory(name);
      }}
    >
      <option value={""}>visi</option>
      <option value={Category.WINE}>{categoryNames[Category.WINE]}</option>
      <option value={Category.STRONG}>{categoryNames[Category.STRONG]}</option>
      <option value={Category.LIGHT}>{categoryNames[Category.LIGHT]}</option>
      <option value={Category.FREE}>{categoryNames[Category.FREE]}</option>
      <option value={Category.OTHER}>{categoryNames[Category.OTHER]}</option>
    </Select>
  );
};

export default CategoryFilter;
