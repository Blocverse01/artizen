import useGlobalStore from "@/store/globalStore";
import { Medusa } from "@medusa-network/medusa-sdk";
import { config } from "@/lib/constants";
import { useSigner } from "wagmi";

const useMedusaAuth = () => {
  const updateMedusa = useGlobalStore((state) => state.updateMedusa);
  const { data: signer } = useSigner();

  const signMessage = async () => {
    if (!signer) return null;
    const medusa = await Medusa.init(config.oracleContractAddress, signer);
    await medusa.signForKeypair();
    updateMedusa(medusa);
    return medusa;
  };

  return { signMessage };
};

export default useMedusaAuth;
