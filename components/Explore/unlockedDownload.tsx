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

const UnlockedContentDownload: React.FC<UnlockedContent> = ({ content, license }) => {
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const stateMedusa = useGlobalStore((state) => state.medusa);
  const { data: signer, isSuccess: isSignerLoaded } = useSigner();
  const decryptions = useGlobalStore((state) => state.decryptions);
  const decryption = decryptions.find((d) => d.requestId.eq(license.requestId));
  const { signMessage } = useMedusaAuth();
  const { preview_url } = content;
  const fileName = preview_url!.substring(preview_url!.lastIndexOf("/") + 1);
  const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
  const downloadName = `artizen-${crypto.randomUUID()}.${fileExtension}`;

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
    const toastOptions = { id: toastId, ...styledToast };
    if (!medusa) {
      toast.loading("Authorizing medusa", {
        ...styledToast,
        id: toastId,
      });
      medusa = (await signMessage())!;
    }
    const { ciphertext, requestId } = decryption;
    const response = await fetch(content.encrypted_url!);
    const encryptedContent = Base64.toUint8Array(await response.text());
    try {
      console.log(ciphertext, requestId);
      const decryptedBytes = await medusa.decrypt(ciphertext, encryptedContent);
      const msg = new TextDecoder().decode(decryptedBytes);
      const fileData = msg.split(",")[1];
      setDownloadLink(
        window.URL.createObjectURL(new Blob([Base64.toUint8Array(fileData)]))
      );
      toast.success("Download ready", toastOptions);
    } catch (error: any) {
      toast.error("Couldn't decrypt", {
        ...styledToast,
        id: toastId,
      });
      console.log(error);
      console.log("Couldn't decrypt");
    }
  };
  return (
    <>
      {downloadLink === null && (
        <button onClick={prepareDownload} className="btn btn-primary">
          Get Download Link
        </button>
      )}
      {downloadLink && (
        <a
          href={downloadLink}
          className="btn bg-app-light text-app-alt-dark border-app-dark"
          download={downloadName}
        >
          Download Premium
        </a>
      )}
    </>
  );
};

export default UnlockedContentDownload;
