import { useState } from "react";
import FilterList from "../components/Filter/FilterList";
import ProductList from "../components/Product/ProductList/ProdutList";
import { ProductDtoFilter, useProductsQuery } from "../generated/graphql";

const Home = () => {
  const [value, setValue] = useState(5);
  const [take, setTake] = useState(value);
  const [filter, setFilter] = useState<ProductDtoFilter>({});

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter: filter,
      take: take,
    },
  });

  if (error) {
    return "error";
  }

  if (loading || !data) return "Loading...";
  const { products } = data;
  return (
    <div>
      <FilterList setFilter={setFilter} filter={filter} />
      <input
        type="number"
        value={value}
        onChange={({ target }) => {
          setValue(Number(target.value));
        }}
        style={{ border: "1px solid gray" }}
      />
      <button onClick={() => setTake(value)}>Apply</button>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
