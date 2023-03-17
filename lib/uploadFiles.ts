import axios, { AxiosResponse } from "axios";
import type {
  FileToUpload,
  UploadFilesRequestBody,
  UploadFilesResponseData,
} from "./types";

export async function uploadFiles(files: FileToUpload[]) {
  const endpoint = "/api/upload-files";
  const uploads: UploadFilesRequestBody = {
    files,
  };
  const { data, status } = await axios.post<
    UploadFilesResponseData,
    AxiosResponse<UploadFilesResponseData>,
    UploadFilesRequestBody
  >(endpoint, uploads);
  if (status !== 201) {
    throw new Error("Upload failed");
  }
  return data.cid;
}
