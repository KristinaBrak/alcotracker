import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Price = {
  __typename?: 'Price';
  value: Scalars['Float'];
  createdAt: Scalars['String'];
};

export type Store = {
  __typename?: 'Store';
  name: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  name: Scalars['String'];
};

export type ProductStatistic = {
  __typename?: 'ProductStatistic';
  id: Scalars['Int'];
  priceCurrent: Scalars['Float'];
  priceMean: Scalars['Float'];
  priceMode: Scalars['Float'];
};

export type ProductDto = {
  __typename?: 'ProductDTO';
  id: Scalars['Int'];
  name: Scalars['String'];
  prices: Array<Price>;
  priceCurrent: Scalars['Float'];
  priceMean: Scalars['Float'];
  priceMode: Scalars['Float'];
  discount: Scalars['Float'];
  category: Scalars['String'];
  store: Scalars['String'];
  alcVolume?: Maybe<Scalars['Float']>;
  volume?: Maybe<Scalars['Float']>;
  link: Scalars['String'];
  image: Scalars['String'];
  createdAt: Scalars['DateTime'];
};


export type ProductSort = {
  field: FilterableField;
  order: Sort;
};

export enum FilterableField {
  AlcVolume = 'alcVolume',
  Volume = 'volume'
}

export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type ProductDtoCondition = {
  operator?: Maybe<BaseOperator>;
  name_like?: Maybe<Scalars['String']>;
  priceCurrent_lte?: Maybe<Scalars['Float']>;
  priceCurrent_gte?: Maybe<Scalars['Float']>;
  priceCurrent_eq?: Maybe<Scalars['Float']>;
  priceMean_lte?: Maybe<Scalars['Float']>;
  priceMean_gte?: Maybe<Scalars['Float']>;
  priceMean_eq?: Maybe<Scalars['Float']>;
  priceMode_lte?: Maybe<Scalars['Float']>;
  priceMode_gte?: Maybe<Scalars['Float']>;
  priceMode_eq?: Maybe<Scalars['Float']>;
  discount_lte?: Maybe<Scalars['Float']>;
  discount_gte?: Maybe<Scalars['Float']>;
  discount_eq?: Maybe<Scalars['Float']>;
  category_like?: Maybe<Scalars['String']>;
  store_like?: Maybe<Scalars['String']>;
  alcVolume_lte?: Maybe<Scalars['Float']>;
  alcVolume_gte?: Maybe<Scalars['Float']>;
  alcVolume_eq?: Maybe<Scalars['Float']>;
  volume_lte?: Maybe<Scalars['Float']>;
  volume_gte?: Maybe<Scalars['Float']>;
  volume_eq?: Maybe<Scalars['Float']>;
};

export enum BaseOperator {
  Or = 'OR',
  And = 'AND'
}

export type ProductDtoFilter = {
  operator?: Maybe<BaseOperator>;
  name_like?: Maybe<Scalars['String']>;
  priceCurrent_lte?: Maybe<Scalars['Float']>;
  priceCurrent_gte?: Maybe<Scalars['Float']>;
  priceCurrent_eq?: Maybe<Scalars['Float']>;
  priceMean_lte?: Maybe<Scalars['Float']>;
  priceMean_gte?: Maybe<Scalars['Float']>;
  priceMean_eq?: Maybe<Scalars['Float']>;
  priceMode_lte?: Maybe<Scalars['Float']>;
  priceMode_gte?: Maybe<Scalars['Float']>;
  priceMode_eq?: Maybe<Scalars['Float']>;
  discount_lte?: Maybe<Scalars['Float']>;
  discount_gte?: Maybe<Scalars['Float']>;
  discount_eq?: Maybe<Scalars['Float']>;
  category_like?: Maybe<Scalars['String']>;
  store_like?: Maybe<Scalars['String']>;
  alcVolume_lte?: Maybe<Scalars['Float']>;
  alcVolume_gte?: Maybe<Scalars['Float']>;
  alcVolume_eq?: Maybe<Scalars['Float']>;
  volume_lte?: Maybe<Scalars['Float']>;
  volume_gte?: Maybe<Scalars['Float']>;
  volume_eq?: Maybe<Scalars['Float']>;
  conditions?: Maybe<Array<ProductDtoCondition>>;
};

export type Query = {
  __typename?: 'Query';
  products: Array<ProductDto>;
  product: ProductDto;
};


export type QueryProductsArgs = {
  sort?: Maybe<Array<ProductSort>>;
  filter?: Maybe<ProductDtoFilter>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  id: Scalars['Int'];
};

export type ProductsQueryVariables = Exact<{
  filter?: Maybe<ProductDtoFilter>;
  sort?: Maybe<Array<ProductSort> | ProductSort>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
}>;


export type ProductsQuery = (
  { __typename?: 'Query' }
  & { products: Array<(
    { __typename?: 'ProductDTO' }
    & Pick<ProductDto, 'id' | 'name' | 'alcVolume' | 'volume' | 'link' | 'image' | 'store' | 'category' | 'priceCurrent' | 'priceMean' | 'priceMode' | 'discount'>
  )> }
);


export const ProductsDocument = gql`
    query Products($filter: ProductDTOFilter, $sort: [ProductSort!], $skip: Int, $take: Int) {
  products(filter: $filter, sort: $sort, skip: $skip, take: $take) {
    id
    name
    alcVolume
    volume
    link
    image
    store
    category
    priceCurrent
    priceMean
    priceMode
    discount
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, baseOptions);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, baseOptions);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;