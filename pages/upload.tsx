import { uploadPhotos } from "@/lib/upload";
import axios from "axios";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import { NextPageWithLayout } from "./_app";
import AppLayout from "@/layouts/AppLayout";

const Upload: NextPageWithLayout = () => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPhotos(files);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!photos || photos.length === 0) return;
    setProcessing(true);
    const uploadedPhotos = await uploadPhotos(photos);
    if (uploadedPhotos && uploadedPhotos.length > 0) {
      const { data, status } = await axios.post("/api/add-content", {
        content: uploadedPhotos,
        ownerAddress: "0xEE02ceB76052f7D6Ac9478D9201f2BB94c79fc5c",
      }); // add content to database
      console.log(data);
      setProcessing(false);
      if (status === 201) {
        alert("Success");
        Router.push("/explore");
      }
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
          Select Files
        </label>
        <input
          id="photos"
          onChange={handleFileChange}
          type="file"
          multiple
          accept="image/*"
          className="mb-6 block text-slate-200"
        />
        <div className="p-5 border-slate-400 border rounded-xl">
          {photos.length > 0 &&
            photos.map((photo, index) => (
              <Image
                key={photo.name}
                alt="selected image"
                src={URL.createObjectURL(photo)}
                width={200}
                className={`rounded-xl inline-block ${index > 0 && "ml-5"}`}
                height={200}
              />
            ))}
          {photos.length === 0 && (
            <div className="h-full min-h-[200px] flex items-center justify-center">
              <div className="h-28 w-32 relative">
                <Image
                  src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
                  alt="no data"
                  fill
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            disabled={processing}
            type="submit"
            className="bg-app-light py-3 flex items-center px-5 text-app-dark text-lg font-medium text-center rounded-lg"
          >
            {processing ? (
              <ScaleLoader color="#0B0B0F" className="ml-2 scale-90" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

Upload.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default Upload;
