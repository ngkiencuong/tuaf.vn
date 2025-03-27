import Layout from "@/layouts";
import "@/styles/globals.css";
import "@/styles/tableContent.css";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { type ReactElement, type ReactNode } from "react";
  import { ModalProvider } from "@/components/ModalContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => (
    <Layout>{page}</Layout>
  ));

  return (
    <ChakraProvider theme={theme}>
      <ModalProvider>{getLayout(<Component {...pageProps} />)}</ModalProvider>
    </ChakraProvider>
  );
};

export default App;