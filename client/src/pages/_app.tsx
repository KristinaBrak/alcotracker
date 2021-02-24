import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../lib/apolloClient";
import "../styles/globals.css";

function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
export default App;
