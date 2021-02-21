import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useState } from "react";
import ProductList from "../components/Product/ProductList/ProdutList";
import { ProductDto, useProductsQuery } from "../generated/graphql";

const client = new ApolloClient({
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const Home = () => {
  const [value, setValue] = useState(5);
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [take, setTake] = useState(value);

  const { error, loading, data } = useProductsQuery({
    client,
    variables: {
      filter: {
        name_like: productName,
        priceMode_lte: 50,
      },
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
      <input
        type="number"
        value={value}
        onChange={({ target }) => {
          setValue(Number(target.value));
        }}
      />
      <input
        type="text"
        value={name}
        onChange={({ target }) => {
          setName(target.value);
        }}
      />
      <button
        onClick={() => {
          setTake(value);
          setProductName(name);
        }}
      >
        Hit it
      </button>
      <ProductList products={products} />
    </div>
  );
};

export default Home;
