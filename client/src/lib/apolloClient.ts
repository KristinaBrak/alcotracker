import { ApolloClient, InMemoryCache } from "@apollo/client";

export const apolloClient = new ApolloClient({
  uri: "https://countries-274616.ew.r.appspot.com",
  cache: new InMemoryCache(),
});
