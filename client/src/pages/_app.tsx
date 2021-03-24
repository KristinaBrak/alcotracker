import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { getDataFromTree } from "@apollo/react-ssr";

import "../styles/globals.css";
import withApollo from "next-with-apollo";
import React, { useEffect } from "react";
import Structure from "../components/Structure/Structure";
import useScrollRestoration from "./useScrollRestoration";
import { pageview } from "../lib/gtag";

function App({ Component, pageProps, apollo, router }) {
  useScrollRestoration(router);

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (process.env.NODE_ENV === "production") {
        pageview(url);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

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
      uri: "https://uzpylimas.online/api",
      credentials: "same-origin",
      cache: new InMemoryCache().restore(initialState) || ({} as any),
    });
  },
  { getDataFromTree }
)(App);
