import { FetchedContentRecord } from "@/lib/types";
import { LicenseBoughtEventObject } from "@/typechain/Artizen";
import React, { useState } from "react";
import useGlobalStore from "@/store/globalStore";
import { useSigner } from "wagmi";
import { Base64 } from "js-base64";
import { toast } from "react-hot-toast";
import { styledToast } from "@/lib/constants";
import useMedusaAuth from "@/hooks/useMedusaAuth";

interface UnlockedContent {
  content: FetchedContentRecord;
  license: LicenseBoughtEventObject;
}

const UnlockedContentDownload: React.FC<UnlockedContent> = ({
  content,
  license,
}) => {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const stateMedusa = useGlobalStore((state) => state.medusa);
  const { data: signer, isSuccess: isSignerLoaded } = useSigner();
  const decryptions = useGlobalStore((state) => state.decryptions);
  const decryption = decryptions.find((d) => d.requestId.eq(license.requestId));
  const { signMessage } = useMedusaAuth();

  const prepareDownload = async () => {
    let medusa = stateMedusa;
    if (!signer) {
      return toast("Connect your wallet", {
        icon: "🔔",
        ...styledToast,
      });
    }
    if (!decryption) {
      return toast("Cipher not found", {
        icon: "🔔",
        ...styledToast,
      });
    }
    const toastId = "prepare-download";
    if (!medusa) {
      toast.loading("Authorizing medusa", {
        ...styledToast,
        id: toastId,
      });
      medusa = (await signMessage())!;
    }
    const { cipher } = decryption;
    const response = await fetch(content.encrypted_url!);
    const encryptedContent = Base64.toUint8Array(await response.text());
    try {
      const decryptedBytes = await medusa.decrypt(cipher, encryptedContent);
      const msg = new TextDecoder().decode(decryptedBytes);
      const fileData = msg.split(",")[1];
      setDownloadLink(
        window.URL.createObjectURL(new Blob([Base64.toUint8Array(fileData)]))
      );
    } catch (error: any) {
      console.log("Couldn't decrypt");
    }
  };
  return (
    <>
      {downloadLink === null && (
        <button
          onClick={prepareDownload}
          className="btn text-sm lg:text-base btn-primary"
        >
          Get Download Link
        </button>
      )}
      {downloadLink && (
        <a
          href={downloadLink}
          className="btn bg-app-light text-sm lg:text-base border-app-dark"
          download={`artizen-${content.cipherId}`}
        >
          Download Premium
        </a>
      )}
    </>
  );
};

export default UnlockedContentDownload;
