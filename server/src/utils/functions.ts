export const replace = (search: string | RegExp) => (replace: string) => (s: string) =>
  s.replace(search, replace);

export function prop<K extends string>(k: K): <T extends Record<K, any>>(obj: T) => T[K];
export function prop<K extends keyof T, T extends object>(k: K, obj: T): T[K];
export function prop<K extends string, T extends Record<K, any>>(
  k: K,
  obj?: T,
): T[K] | ((obj: T) => T[K]) {
  if (obj === undefined) {
    return <T extends Record<K, any>>(obj: T): T[K] => obj[k];
  } else {
    return obj[k];
  }
}

export const trace =
  <T>(tag: string) =>
  (x: T) => {
    console.log(tag, x);
    return x;
  };

export const inc = (x: number) => x + 1;
export const text = (x: string) => {
  return x;
};
