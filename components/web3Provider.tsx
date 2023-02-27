import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ConnectKitProvider } from "connectkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { APP_NAME, hyperspace } from "@/lib/constants";

type DefaultConnectorsProps = {
  chains?: Chain[];
  appName: string;
};

const getDefaultConnectors = ({ chains, appName }: DefaultConnectorsProps) => {
  return [
    new MetaMaskConnector({
      chains,
      options: {
        shimDisconnect: true,
        shimChainChangedDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: false,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName,
        headlessMode: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === "string"
              ? detectedName
              : detectedName.join(", ")
          })`,
      },
    }),
  ];
};

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { chains, provider } = configureChains(
    [hyperspace],
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
      jsonRpcProvider({
        rpc: (chain: Chain) => ({
          http: chain.rpcUrls.private.http[0],
        }),
      }),
      (chain: Chain) => ({
        chain,
        provider: () =>
          new JsonRpcProvider(
            {
              url: chain.rpcUrls.private.http[0],
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_GLIF_RPC_AUTH_TOKEN}`,
              },
            },
            { chainId: chain.id, name: chain.network }
          ),
      }),
    ],
    {
      pollingInterval: 5_000,
    }
  );

  const connectors = getDefaultConnectors({ chains, appName: APP_NAME });

  const client = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider mode={"dark"}>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
