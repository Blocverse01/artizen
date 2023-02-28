import create from "zustand";
import { SecretKey, PublicKey, Medusa } from "@medusa-network/medusa-sdk";
import {
  ContentDecryptionEventObject,
  LicenseBoughtEventObject,
} from "@/typechain/Artizen";

interface GlobalState {
  medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null;

  updateMedusa: (
    medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
  ) => void;
  licenses: LicenseBoughtEventObject[];
  decryptions: ContentDecryptionEventObject[];
  updateLicenses: (licenses: LicenseBoughtEventObject[]) => void;
  updateDecryptions: (decryptions: ContentDecryptionEventObject[]) => void;
  addLicense: (license: LicenseBoughtEventObject) => void;
  addDecryption: (decryption: ContentDecryptionEventObject) => void;
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
  updateDecryptions: (decryptions: ContentDecryptionEventObject[]) =>
    set((state) => ({ decryptions })),

  addLicense: (license: LicenseBoughtEventObject) =>
    set(({ licenses }) => {
      if (!licenses.find((l) => l.requestId === license.requestId)) {
        return { licenses: [license, ...licenses] };
      }
      return { licenses };
    }),
  addDecryption: (decryption: ContentDecryptionEventObject) =>
    set(({ decryptions }) => {
      if (!decryptions.find((d) => d.requestId === decryption.requestId)) {
        return { decryptions: [decryption, ...decryptions] };
      }
      return { decryptions };
    }),
}));

export default useGlobalStore;
