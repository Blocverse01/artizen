import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { JsonRpcProvider } from "@ethersproject/providers";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { APP_NAME, hyperspace } from "@/lib/constants";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const { chains, provider } = configureChains(
    [hyperspace],
    [
      alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
      (chain: Chain) =>
        ({
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
        } as any),
    ],
    {
      pollingInterval: 5_000,
    }
  );

  const { connectors: rainbowkitConnectors } = getDefaultWallets({
    appName: APP_NAME,
    chains,
  });

  const client = createClient({
    autoConnect: true,
    connectors: rainbowkitConnectors,
    provider,
  });

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
