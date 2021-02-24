import React, { useState } from "react";
import { ProductDtoFilter } from "../../generated/graphql";

interface Props {
  setCategory: (category: string) => void;
}

const categories1 = [
  "alus",
  "sidras",
  "vynas",
  "stiprieji",
  "nealkoholiniai",
  "kiti",
];
const categories = [
  { id: "category-light", en: "light", lt: "lengvieji", category: "light" },
  { id: "category-wine", en: "wine", lt: "vynas", category: "wine" },
  { id: "category-strong", en: "strong", lt: "stiprieji", category: "strong" },
  { id: "category-free", en: "free", lt: "nealkoholiniai", category: "free" },
  { id: "category-other", en: "other", lt: "kiti", category: "other" },
];

const CategoryFilter: React.FC<Props> = ({ setCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  return (
    <ul style={{ margin: "10px" }}>
      {categories.map((category) => (
        <button
          key={`button-${category.id}`}
          onClick={() => {
            setCategory(category.category);
            setSelectedCategory(category.id);
          }}
          style={{
            margin: "10px",
            color: selectedCategory === category.id ? "blue" : "black",
          }}
        >
          <li key={`category-${category.id}`}>{category.lt}</li>
        </button>
      ))}
    </ul>
  );
};

export default CategoryFilter;
