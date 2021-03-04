import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { getDataFromTree } from "@apollo/react-ssr";

import "../styles/globals.css";
import withApollo from "next-with-apollo";
import React from "react";
import Structure from "../components/Structure/Structure";

function App({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <ChakraProvider>
        <Structure>
          <Component {...pageProps} />
        </Structure>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: "http://88.119.2.19:4000",
      credentials: "same-origin",
      cache: new InMemoryCache().restore(initialState) || ({} as any),
    });
  },
  { getDataFromTree }
)(App);
