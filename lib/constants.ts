import { Address, Chain } from "wagmi";

export enum LICENSE_PRICE {
  STANDARD = 200,
}

export const EXPLORE_PAGE_SIZE = 8;

export const APP_NAME = "OnlyFiles" as const;

export const hyperspace: Chain = {
  id: 3141,
  name: "Filecoin Hyperspace Testnet",
  network: "hyperspace",
  nativeCurrency: {
    decimals: 18,
    name: "Filecoin",
    symbol: "tFIL",
  },
  rpcUrls: {
    default: { http: ["https://api.hyperspace.node.glif.io/rpc/v1"] },
    private: { http: ["https://hyperspace.node.glif.io/archive/lotus/rpc/v1"] },
    public: { http: ["https://api.hyperspace.node.glif.io/rpc/v1"] },
  },
  blockExplorers: {
    etherscan: { name: "Filfox", url: "https://hyperspace.filfox.info/en" },
    default: { name: "Filfox", url: "https://hyperspace.filfox.info/en" },
  },
  testnet: true,
};
