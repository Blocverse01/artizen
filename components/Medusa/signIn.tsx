import { FC } from "react";
import useGlobalStore from "@/store/globalStore";
import { Medusa } from "@medusa-network/medusa-sdk";
import { useSigner } from "wagmi";
import { config } from "@/lib/constants";

const SignIn: FC = () => {
  const medusa = useGlobalStore((state) => state.medusa);
  const updateMedusa = useGlobalStore((state) => state.updateMedusa);
  const { data: signer } = useSigner();

  const signMessage = async () => {
    if (!signer) return;
    const medusa = await Medusa.init(config.oracleContractAddress, signer);
    await medusa.signForKeypair();
    updateMedusa(medusa);
  };

  if (medusa?.keypair) {
    return (
      <button
        type="button"
        className="bg-gray-700 hover:bg-gray-500 hover:cursor-pointer text-gray-50 py-2 px-4 rounded"
        onClick={() => medusa.setKeypair(null!)}
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      type="button"
      className="bg-gray-700 hover:bg-gray-500 hover:cursor-pointer text-gray-50 py-2 px-4 rounded"
      onClick={() => signMessage()}
    >
      Sign in
    </button>
  );
};

export default SignIn;
