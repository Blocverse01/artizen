import { LICENSE_TYPE, config, styledToast } from "@/lib/constants";
import { FetchedContentRecord } from "@/lib/types";
import useGlobalStore from "@/store/globalStore";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useAccount, useSigner } from "wagmi";
import useMedusaAuth from "@/hooks/useMedusaAuth";
import { Artizen__factory } from "@/typechain";
import { G1PointStruct, LicenseBoughtEventObject } from "@/typechain/Artizen";
import { BigNumber, ethers } from "ethers";
import UnlockedContentDownload from "./unlockedDownload";

interface ContentModalProps {
  content: FetchedContentRecord;
  license: LicenseBoughtEventObject | null;
}

const ContentModal = ({ content, license }: ContentModalProps) => {
  const { preview_url, description, rootCid, cipherId } = content!;
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const stateMedusa = useGlobalStore((state) => state.medusa);
  const { signMessage } = useMedusaAuth();
  const purchased = !!license;
  console.log(purchased);

  const buyLicense = async (license: LICENSE_TYPE) => {
    let evmPoint: G1PointStruct | null = null;
    let medusa = stateMedusa;
    const toastId = "buy-license";
    try {
      if (!isConnected || !signer) {
        toast("Connect your wallet", {
          icon: "🔔",
          ...styledToast,
          id: toastId,
        });
        return;
      }
      if (!medusa) {
        toast.loading("Authorizing medusa", {
          ...styledToast,
          id: toastId,
        });
        medusa = await signMessage();
      }

      if (medusa?.keypair) {
        const { x, y } = medusa.keypair.pubkey.toEvm();
        evmPoint = { x, y };
      }

      if (!evmPoint || !cipherId) {
        throw new Error("No cipherID or evmPoint not set");
      }
      const artizenContract = Artizen__factory.connect(
        config.appContractAddress,
        signer
      );
      toast.loading("Awaiting transaction approval", {
        ...styledToast,
        id: toastId,
      });
      const transaction = await artizenContract.buyLicense(
        BigNumber.from(cipherId),
        evmPoint,
        license,
        {
          value: ethers.utils.parseEther("0.01"),
        }
      );
      toast.loading("Processing transaction", {
        ...styledToast,
        id: toastId,
      });
      const receipt = await transaction.wait();
      if (receipt.status === 1) {
        toast.success("Premium license activated", {
          ...styledToast,
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error("Couldn't purchase license", {
        ...styledToast,
        id: toastId,
      });
      console.log(error);
    }
  };

  return (
    <>
      <input type="checkbox" id="content-modal" className="modal-toggle" />
      <label className="modal" htmlFor="content-modal">
        <div className="modal-box w-11/12 h-full bg-slate-800 max-w-5xl relative">
          <label
            htmlFor="content-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <div className="flex pt-6 lg:pt-0 lg:px-5 lg:py-2 space-x-5 lg:space-x-8">
            <a
              href={`/api/imageProxy?imageUrl=${preview_url!}`}
              download={`artizen-${rootCid ?? cipherId}`}
              className="btn-secondary btn text-sm lg:text-base"
            >
              Free Download
            </a>
            <div>
              {purchased && (
                <UnlockedContentDownload content={content} license={license} />
              )}
              {!purchased && (
                <button
                  onClick={() => buyLicense(LICENSE_TYPE.BASIC)}
                  type="button"
                  className="btn btn-primary text-sm lg:text-base"
                >
                  Buy Premium
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center h-[80%] lg:h-[84%] w-[100%] mx-auto mt-8">
            <section className="relative h-full w-full">
              <Image
                src={`/api/imageProxy?imageUrl=${preview_url!}`}
                alt={description!}
                fill
                className="object-scale-down"
              />
            </section>
          </div>
        </div>
      </label>
    </>
  );
};

export default ContentModal;
