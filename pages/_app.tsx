import { SFPro } from "@/fonts/setup";
import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import Web3Provider from "@/components/web3Provider";
import "@rainbow-me/rainbowkit/styles.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Web3Provider>
      {getLayout(
        <div className={`${SFPro.variable} font-sf-pro`}>
          <Component {...pageProps} />
        </div>
      )}
    </Web3Provider>
  );
}
