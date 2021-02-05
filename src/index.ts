import { exit } from "process";
import { fetchBottleryProducts } from "./stores/bottlery/bottleryService";
import * as dotenv from "dotenv";
import {
  fetchRimiCategoryProducts,
  fetchRimiProducts,
} from "./stores/rimi/rimiService";
import { fetchBarboraProducts } from "./stores/barbora/barboraService";
dotenv.config();

(async () => {
  // const result = await fetchBottleryProducts();
  // console.log(result[0]);
  // const rimiProducts = await fetchRimiProducts();
  // console.log(rimiProducts.length);

  const barboraProducts = await fetchBarboraProducts();
  console.log(barboraProducts.filter((p) => p.alcVolume).length);
})()
  .catch((error) => {
    console.error("[ERROR]", error);
    exit(1);
  })
  .finally(() => exit(0));
