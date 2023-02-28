import axios from "axios";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { NextPageWithLayout } from "./_app";
import AppLayout from "@/layouts/AppLayout";
import useGlobalStore from "@/store/globalStore";
import watermark from "@/lib/watermarkPhoto";
import { config } from "@/lib/constants";
import { Base64 } from "js-base64";
import { nanoid } from "nanoid";
import { AddContentRequestBody, Dimension } from "@/lib/types";
import storage from "@/lib/storage";
import { useAccount, useSigner } from "wagmi";
import { Artizen__factory } from "@/typechain";
import SignIn from "@/components/Medusa/signIn";
import { BigNumber } from "ethers";

const Upload: NextPageWithLayout = () => {
  const [photo, setPhoto] = useState<File>();
  const [description, setDescription] = useState("");
  const [fileText, setFileText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const medusa = useGlobalStore((state) => state.medusa);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    console.log(value);
    setDescription(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const fileText = event.target?.result as string;
        setFileText(fileText);
      };
      reader.onerror = (error) => {
        console.log("File Input Error: ", error);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!signer)
      return alert("Please connect your wallet to contribute content");
    if (!medusa) return alert("Click the Sign in button");
    if (!photo || !medusa) return alert("Add a photo");
    try {
      setProcessing(true);
      const buff = new TextEncoder().encode(fileText);
      const { encryptedData, encryptedKey } = await medusa.encrypt(
        buff,
        config.appContractAddress
      );
      const b64EncryptedData = Base64.fromUint8Array(encryptedData);
      watermark.withCompressorJs(photo, async (watermarkedPhoto) => {
        try {
          const img = await createImageBitmap(photo);
          const dimension: Dimension = {
            width: img.width,
            height: img.height,
          };
          const filename = nanoid();
          const ext = photo.type.split("/")[1];
          const previewPath = `artizen_${filename}_preview.${ext}`;
          const encryptedPath = `artizen_${filename}_encrypted`;
          const cid = await storage.store([
            new File([watermarkedPhoto], previewPath),
            new File([b64EncryptedData], encryptedPath, { type: "text/plain" }),
          ]);
          const uploaded = {
            cid,
            preview_url: `https://${cid}.ipfs.w3s.link/${previewPath}`,
            encrypted_url: `https://${cid}.ipfs.w3s.link/${encryptedPath}`,
          };
          const artizenContract = Artizen__factory.connect(
            config.appContractAddress,
            signer
          );
          const transaction = await artizenContract.contribute(
            encryptedKey,
            uploaded.encrypted_url
          );
          const receipt = await transaction.wait();
          const cipherID = receipt?.events![1]?.args!.contentId as BigNumber;
          const { data, status } = await axios.post("/api/add-content", {
            content: {
              ...uploaded,
              cipherID: cipherID.toNumber(),
              description,
              dimension,
            },
            ownerAddress: address!,
          } satisfies AddContentRequestBody); // add content to database
          console.log(data);
          setProcessing(false);
          if (status === 201) {
            alert("Success");
            Router.push("/explore");
          }
        } catch (error) {
          console.log(error);
          setProcessing(false);
        }
      });
    } catch (error: any) {
      setProcessing(false);
      console.log(error);
    }
  };

  return (
    <main>
      <p className="bg-app-alt-dark p-5 mb-6 max-w-4xl mx-auto text-white text-lg font-medium rounded-lg">
        {
          "We're building Artizen as DAO to become a storage onramp for stock photos and videos on Filecoin where content is created by the community for the community. While we're building, you can contribute test content to Artizen."
        }
      </p>
      <h1 className="text-slate-200 mb-6 w-fit mx-auto text-center text-2xl lg:text-4xl font-bold">
        Contribute Content
      </h1>
      <form
        className="py-6 px-7 lg:px-14 lg:py-12 shadow-xl border-app-light rounded-xl max-w-4xl border mx-auto"
        onSubmit={handleSubmit}
      >
        <label htmlFor="photos" className="text-slate-200 mb-2 block text-lg">
          Select Photo
        </label>
        <input
          id="photos"
          onChange={handleFileChange}
          type="file"
          accept="image/*"
          className="mb-6 block text-slate-200"
        />
        {photo && (
          <div className="p-5 border-slate-400 w-fit border rounded-xl">
            <Image
              key={photo.name}
              alt="selected image"
              src={URL.createObjectURL(photo)}
              width={200}
              className={`rounded-xl inline-block}`}
              height={200}
            />
          </div>
        )}
        <div className="my-6">
          <label
            className="text-slate-200 mb-2 block text-lg"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            id="description"
            className="focus:border-app-light p-4 text-white w-full bg-transparent border border-slate-400 outline-none rounded-xl"
            rows={5}
          ></textarea>
        </div>
        <div className="flex justify-end mt-6">
          {!medusa && <SignIn />}
          {medusa && (
            <button
              disabled={processing}
              type="submit"
              className="bg-app-light py-3 flex items-center px-5 text-app-dark text-lg font-medium text-center rounded-lg"
            >
              {processing ? (
                <>
                  {"Uploading"}
                  <ScaleLoader color="#0B0B0F" className="ml-2 scale-90" />
                </>
              ) : (
                "Submit"
              )}
            </button>
          )}
        </div>
      </form>
    </main>
  );
};

Upload.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Upload;
