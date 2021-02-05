import { exit } from "process";
import { fetchBottleryProducts } from "./stores/bottlery/bottleryService";
import * as dotenv from "dotenv";
import {
  fetchRimiCategoryProducts,
  fetchRimiProducts,
} from "./stores/rimi/rimiService";
dotenv.config();

(async () => {
  // const result = await fetchBottleryProducts();
  // console.log(result[0]);
  const rimiProducts = await fetchRimiProducts();
  console.log(rimiProducts.length);

  // const alus = await fetchRimiCategoryProducts({
  //   name: "alus",
  //   link:
  //     "https://www.rimi.lt/e-parduotuve/lt/produktai/alkoholiniai-gerimai/alus/c/SH-1-1?pageSize=100&query=",
  // });
  // console.log(alus.length);
})()
  .catch((error) => {
    console.error("[ERROR]", error);
    exit(1);
  })
  .finally(() => exit(0));
