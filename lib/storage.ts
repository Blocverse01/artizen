import { Web3Storage, File } from "web3.storage";

const apiToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN!;
class Storage {
  web3Storage = new Web3Storage({ token: apiToken });

  async store(files: File[]) {
    const cid = await this.web3Storage.put(files);
    return cid;
  }
}

const storage = new Storage();

export default storage;

export { File };
