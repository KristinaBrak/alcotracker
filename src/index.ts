import { fetchProducts } from "./stores/bottlery/bottleryService";

(async () => {
  const result = await fetchProducts();
  console.log(result[0]);
})().catch((error) => console.error(error.message));
