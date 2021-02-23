import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useState } from "react";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDto,
  ProductDtoFilter,
  useProductsQuery,
} from "../generated/graphql";
import FilterList from "../components/Filter/FilterList";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const Home = () => {
  const [value, setValue] = useState(5);
  const [take, setTake] = useState(value);
  const [filter, setFilter] = useState<ProductDtoFilter>({});

  const { error, loading, data } = useProductsQuery({
    client,
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
