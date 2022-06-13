import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  // const client = createClient({
  //   url: "http://localhost:4000/graphql",
  //   fetchOptions: {
  //     credentials: "include",
  //   },
  //   dedupExchange
  // });

  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
