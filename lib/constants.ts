import { Address, Chain } from "wagmi";

export enum LICENSE_TYPES {
  BASIC,
  PREMIUM,
}

export const EXPLORE_PAGE_SIZE = 8;

export const APP_NAME = "Artizen";

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

type Config = {
  appContractAddress: Address;
  oracleContractAddress: Address;
};

export const config: Config = {
  appContractAddress: "0x9E4D195a206e43950337fF4044eDfF2e77f78354", // Artizen.sol on hyperspace
  oracleContractAddress: "0xb0dd3eb2374b21b6efacf41a16e25ed8114734e0",
};
