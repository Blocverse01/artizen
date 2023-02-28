import create from "zustand";
import { SecretKey, PublicKey, Medusa } from "@medusa-network/medusa-sdk";

interface GlobalState {
  medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null;

  updateMedusa: (
    medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
  ) => void;
}

const useGlobalStore = create<GlobalState>()((set) => ({
  medusa: null,
  listings: [],
  sales: [],
  decryptions: [],

  updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) =>
    set((state) => ({ medusa })),
}));

export default useGlobalStore;
