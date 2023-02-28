import { ToastOptions } from "react-hot-toast";
import { Address, Chain } from "wagmi";

export enum LICENSE_TYPE {
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
  appContractAddress: "0xf2037D313eDC9238ABa59DAdb16869b93d579173", // Artizen.sol on hyperspace
  oracleContractAddress: "0xb0dd3eb2374b21b6efacf41a16e25ed8114734e0",
};

export const styledToast: ToastOptions = {
  style: {
    border: "1px solid #30FFB4",
    padding: "16px",
    color: "#30FFB4",
    backgroundColor: "#0B0B0F",
  },
  iconTheme: {
    primary: "#30FFB4",
    secondary: "#16161A",
  },
};
