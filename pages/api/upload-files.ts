import storage, { File } from "@/lib/storage";
import { FileToUpload, UploadFilesRequestBody } from "@/lib/types";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";

interface ResponseData {
  cid?: string;
  error?: string;
}

export const config: PageConfig = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};

async function url2File(url: string, fileName: string) {
  const blob = await (await fetch(url)).blob();
  return new File([blob], fileName, { type: blob.type });
}

const makeFileObjects = async (files: FileToUpload[]): Promise<File[]> => {
  const promises = files.map(
    (file) =>
      new Promise(async (resolve: (value: File) => void, reject) => {
        const filePropertyBag = { type: file.type };
        if (file.dataUrl) {
          resolve(await url2File(file.dataUrl, file.name));
        }
        resolve(new File([file.text!], file.name, filePropertyBag));
      })
  );
  return await Promise.all(promises);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { files }: UploadFilesRequestBody = req.body;
    const cid = await storage.store(await makeFileObjects(files));
    console.log(`Uploaded to root cid: ${cid}`);
    return res.status(201).json({ cid });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
