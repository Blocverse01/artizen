import { nanoid } from "nanoid";
import lit from "./lit";
import storage from "./storage";
import { watermarkWithText } from "./watermarkPhoto";

const uploadPhotos = async (photos: File[]) => {
  const uploadedPhotos = [];
  for (const photo of photos) {
    const watermarkPhoto = await watermarkWithText(photo);
    const encryptedPhoto = await lit.encryptFile(photo);
    if (!encryptedPhoto || !watermarkPhoto) {
      return null;
    }
    const filename = nanoid();
    const previewPath = `${filename}_watermarked.png`;
    const cid = await storage.store([
      new File([watermarkPhoto], previewPath),
      new File([encryptedPhoto], `${filename}_encrypted.zip`),
    ]);
    console.log(cid);
    uploadedPhotos.push({
      cid,
      preview_url: `https://${cid}.ipfs.w3s.link/${previewPath}`,
    });
  }
  return uploadedPhotos;
};

export { uploadPhotos };
