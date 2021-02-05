import { isDebug } from "./env.utils";

export const debug = (...args: any[]) => {
  if (isDebug()) {
    console.debug(`[DEBUG] ${args}`);
  }
};
