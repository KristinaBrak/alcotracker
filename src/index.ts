import { exit } from "process";
import { fetchBottleryProducts } from "./stores/bottlery/bottleryService";
import * as dotenv from "dotenv";
dotenv.config();

(async () => {
  const result = await fetchBottleryProducts();
  console.log(result[0]);
})()
  .catch((error) => {
    console.error("[ERROR]", error);
    exit(1);
  })
  .finally(() => exit(0));
