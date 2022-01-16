export type FetchData = <T = string>(url: string, ...args: any[]) => Promise<T>;

export type Url = string;
