import { create } from "zustand";
import {
  SecretKey,
  PublicKey,
  Medusa,
  HGamalEVMCipher as Ciphertext,
} from "@medusa-network/medusa-sdk";
import { LicenseBoughtEventObject } from "@/typechain/Artizen";
import { BigNumber } from "ethers";

export interface Decryption {
  requestId: BigNumber;
  ciphertext: Ciphertext;
}

interface GlobalState {
  medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null;

  updateMedusa: (
    medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
  ) => void;
  licenses: LicenseBoughtEventObject[];
  decryptions: Decryption[];
  updateLicenses: (licenses: LicenseBoughtEventObject[]) => void;
  updateDecryptions: (decryptions: Decryption[]) => void;
  addLicense: (license: LicenseBoughtEventObject) => void;
  addDecryption: (decryption: Decryption) => void;
}

const useGlobalStore = create<GlobalState>()((set) => ({
  medusa: null,
  listings: [],
  licenses: [],
  decryptions: [],

  updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) =>
    set((state) => ({ medusa })),
  updateLicenses: (licenses: LicenseBoughtEventObject[]) =>
    set((state) => ({ licenses })),
  updateDecryptions: (decryptions: Decryption[]) =>
    set((state) => ({ decryptions })),

  addLicense: (license: LicenseBoughtEventObject) =>
    set(({ licenses }) => {
      if (!licenses.find((l) => l.requestId === license.requestId)) {
        return { licenses: [license, ...licenses] };
      }
      return { licenses };
    }),
  addDecryption: (decryption: Decryption) =>
    set(({ decryptions }) => {
      if (!decryptions.find((d) => d.requestId === decryption.requestId)) {
        return { decryptions: [decryption, ...decryptions] };
      }
      return { decryptions };
    }),
}));

export default useGlobalStore;
