import storage from "@/lib/storage";
import { useEffect, useState } from "react";
import { Web3File } from "web3.storage";

export default function useFetchFiles(rootCid: string) {
  const [files, setFiles] = useState<Web3File[]>();

  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await storage.web3Storage.get(rootCid);
        if (res && res.ok) {
          const fetchedFiles = await res.files();
          console.log(fetchedFiles);
          setFiles(fetchedFiles);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
    fetchFiles();
  }, [rootCid]);

  return { files };
}
