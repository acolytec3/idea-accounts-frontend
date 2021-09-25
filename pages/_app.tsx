import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      <Provider session={pageProps.session}>
        <Component {...pageProps}></Component>
      </Provider>
    </ChakraProvider>
  );
};

export default App;
