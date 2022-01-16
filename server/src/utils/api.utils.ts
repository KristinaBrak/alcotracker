import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { withCache } from '../cache';
import { prop } from './functions';

type FetchHtml = (url: string, config?: AxiosRequestConfig) => Promise<string>;
export const fetchHtml: FetchHtml = async (url, config) => {
  const { data } = await axios.get<string>(url, config).catch(() => {
    throw new Error(`Iki API error at ${url}`);
  });
  return data;
};

const axiosFetch = <T = string>(url: string, config?: AxiosRequestConfig, ...args: any[]) =>
  axios.request<T>({ ...config, url }).then(prop('data'));

export const fetchData = process.env.CACHED ? withCache(axiosFetch) : axiosFetch;
