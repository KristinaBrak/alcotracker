import { useReducer, useState } from "react";
import Filter from "../components/Filter/Filter";
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

  return (
    <div>
      <Filter setFilter={setFilter} filter={filter} />
      <input
        type="number"
        value={value}
        onChange={({ target }) => {
          setValue(Number(target.value));
        }}
        style={{ border: "1px solid gray" }}
      />
      <button onClick={() => setTake(value)}>Apply</button>
      <ProductList productsData={data} loading={loading} error={error} />
    </div>
  );
};

export default Home;
