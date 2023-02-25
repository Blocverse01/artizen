import { nanoid } from "nanoid";
import lit from "./lit";
import storage from "./storage";
import watermark from "./watermarkPhoto";
import { CIDString } from "web3.storage";
import { Dimension } from "./types";

type BlobOrNull = Blob | null;

const WATERMARK_HANDLER = watermark.withCompressorJs; // compress and watermark with compressorjs

const handlePhotoUpload = async (
  previewPhoto: BlobOrNull,
  encryptedPhoto: BlobOrNull,
  dimension: Dimension
) => {
  if (!previewPhoto || !encryptedPhoto) return null;
  const filename = nanoid();
  const ext = previewPhoto.type.split("/")[1];
  const previewPath = `${filename}_preview.${ext}`;
  const encryptedPath = `${filename}_encrypted.zip`;
  const cid = await storage.store([
    new File([previewPhoto], previewPath),
    new File([encryptedPhoto], encryptedPath),
  ]);
  return {
    cid,
    preview_url: `https://${cid}.ipfs.w3s.link/${previewPath}`,
    encrypted_url: `https://${cid}.ipfs.w3s.link/${encryptedPath}`,
    dimension,
  };
};

const uploadPhotos = async (photos: File[]) => {
  const uploadedPhotos: Array<{
    cid: CIDString;
    preview_url: string;
    encrypted_url: string;
    dimension: Dimension;
  }> = [];
  const promises: Promise<any>[] = [];
  photos.forEach((photo) => {
    promises.push(
      new Promise(async (resolve) => {
        const img = await createImageBitmap(photo);
        const dimension: Dimension = {
          width: img.width,
          height: img.height,
        };
        const encryptedPhoto = await lit.encryptFile(photo);
        WATERMARK_HANDLER(photo, async (watermarkedPhoto) => {
          const uploaded = await handlePhotoUpload(
            watermarkedPhoto,
            encryptedPhoto,
            dimension
          );
          if (uploaded) {
            uploadedPhotos.push(uploaded);
          }
          resolve(null);
        });
      })
    );
  });
  await Promise.all(promises);
  return uploadedPhotos;
};

export { uploadPhotos };
