import { FC, useEffect } from "react";
import { useAccount, useContract, useContractEvent, useProvider } from "wagmi";
import { LICENSE_TYPE, config } from "@/lib/constants";
import CONTRACT_ABI from "@/lib/abi";
import useGlobalStore from "@/store/globalStore";
import { BigNumber, ethers } from "ethers";
import { HGamalEVMCipher as Ciphertext } from "@medusa-network/medusa-sdk";
import {
  ContentDecryptionEventObject,
  LicenseBoughtEventObject,
} from "@/typechain/Artizen";

const EventsStreamer: FC = () => {
  const provider = useProvider();
  const { address } = useAccount();

  const updateLicenses = useGlobalStore((state) => state.updateLicenses);
  const updateDecryptions = useGlobalStore((state) => state.updateDecryptions);

  const addLicense = useGlobalStore((state) => state.addLicense);
  const addDecryption = useGlobalStore((state) => state.addDecryption);

  useContractEvent({
    address: config.appContractAddress,
    abi: CONTRACT_ABI,
    eventName: "LicenseBought",
    listener(
      licensee: string,
      contentId: BigNumber,
      licenseType: LICENSE_TYPE,
      price: BigNumber,
      requestId: BigNumber
    ) {
      if (licensee === address) {
        addLicense({ licensee, contentId, licenseType, price, requestId });
      }
    },
  });

  useContractEvent({
    address: config.appContractAddress,
    abi: CONTRACT_ABI,
    eventName: "ContentDecryption",
    listener(requestId: BigNumber, cipher: Ciphertext) {
      addDecryption({ requestId, cipher: cipher as any });
    },
  });

  const medusaFans = useContract({
    address: config.appContractAddress,
    abi: CONTRACT_ABI,
    signerOrProvider: provider,
  });

  useEffect(() => {
    const getEventsForFilter = async (
      filter: ethers.EventFilter
    ): Promise<ethers.Event[]> => {
      const events = await medusaFans!.queryFilter(filter, 100000);
      console.log(events);
      return events
        .reverse()
        .filter((event) => !event.removed)
        .filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.transactionHash === value.transactionHash &&
                t.logIndex === value.logIndex
            )
        );
    };

    const getEvents = async () => {
      const iface = new ethers.utils.Interface(CONTRACT_ABI);

      const newLicenses = await getEventsForFilter(
        medusaFans!.filters.LicenseBought(address!, null, null, null, null)
      );
      const licenses = newLicenses.map((filterTopic: ethers.Event) => {
        const result = iface.parseLog(filterTopic);
        const { licensee, contentId, licenseType, price, requestId } =
          result.args;
        return {
          licensee,
          contentId,
          licenseType,
          price,
          requestId,
        } as LicenseBoughtEventObject;
      });
      updateLicenses(licenses);

      const contentDecryptions = await getEventsForFilter(
        medusaFans!.filters.ContentDecryption(null, null)
      );
      console.log(contentDecryptions);
      const decryptions = contentDecryptions.map(
        (filterTopic: ethers.Event) => {
          const result = iface.parseLog(filterTopic);
          const { requestId, cipher } = result.args;
          return { requestId, cipher } as ContentDecryptionEventObject;
        }
      );
      updateDecryptions(decryptions);
    };
    if (medusaFans) {
      getEvents();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return <> </>;
};

export default EventsStreamer;