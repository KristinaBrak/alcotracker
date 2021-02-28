import { useState } from "react";
import Filter from "../components/Filter/Filter";
import ProductList from "../components/Product/ProductList/ProdutList";
import {
  ProductDtoFilter,
  Sort,
  SortableField,
  useProductsQuery,
} from "../generated/graphql";
import { Input, Box } from "@chakra-ui/react";

const Home = () => {
  const [value, setValue] = useState(20);
  const [take, setTake] = useState(value);
  const [filter, setFilter] = useState<ProductDtoFilter>({});

  const { error, loading, data } = useProductsQuery({
    variables: {
      filter: filter,
      take: take,
      sort: [{ field: SortableField.Discount, order: Sort.Desc }],
    },
  });

  return (
    <Box>
      <Filter setFilter={setFilter} filter={filter} />
      <Input
        type="number"
        value={value}
        onChange={({ target }) => {
          setValue(Number(target.value));
        }}
        style={{ border: "1px solid gray" }}
      />
      <button onClick={() => setTake(value)}>Apply</button>
      <ProductList productsData={data} loading={loading} error={error} />
    </Box>
  );
};

export default Home;
