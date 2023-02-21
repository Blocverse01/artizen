import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { nanoid } from "nanoid";

const client = new LitJsSdk.LitNodeClient({
  chain: "polygon",
});
const chain = "polygon";

/**
 * Access control for a wallet with > 0.00001 ETH
 * const accessControlConditionsETHBalance = [
  {
    contractAddress: '',
    standardContractType: '',
    chain,
    method: 'eth_getBalance',
    parameters: [
      ':userAddress',
      'latest'
    ],
    returnValueTest: {
      comparator: '>=',
      value: '10000000000000'
    }
  }
]
 */

// Must hold at least one Monster Suit NFT (https://opensea.io/collection/monster-suit)
const accessControlConditionsToken = [
  {
    contractAddress: "0x923aEC84D20799cF57E7f12C15C893FDDaf37e2e",
    standardContractType: "ERC20",
    chain,
    method: "balanceOf",
    parameters: [":userAddress"],
    returnValueTest: {
      comparator: ">",
      value: "0",
    },
  },
];

class Lit {
  litNodeClient: LitJsSdk.LitNodeClient | undefined;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptFile(file: File) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    if (!this.litNodeClient) return null;
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const encryptedFile = await LitJsSdk.encryptFileAndZipWithMetadata({
      file,
      authSig,
      chain,
      litNodeClient: this.litNodeClient,
      readme: "Test file",
      accessControlConditions: accessControlConditionsToken,
    });
    if (!encryptedFile) {
      throw new Error("Could not encrypt file");
    }

    return encryptedFile.zipBlob as Blob;
  }

  async decryptFile(encryptedFile: Blob, file_type: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    const { decryptedFile, metadata } =
      (await LitJsSdk.decryptZipFileWithMetadata({
        litNodeClient,
        authSig,
        file: encryptedFile,
      })) || {};
    if (!decryptedFile || !metadata) {
      throw new Error("Could not decrypt file");
    }
    return new File([decryptedFile], `artizen_${nanoid()}`, {
      type: file_type,
    });
  }
}

const lit = new Lit();

export default lit;
