import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apolloClient";
import { ChakraProvider } from "@chakra-ui/react";

import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default App;
