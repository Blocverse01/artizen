import { ContentRecord } from "@/xata";
import { RecordArray, SelectedPick } from "@xata.io/client";
import { Address } from "wagmi";

export type FetchedContentRecord = Readonly<SelectedPick<ContentRecord, ["*"]>>;
export type PaginatedContentRecords = RecordArray<
  Readonly<SelectedPick<ContentRecord, ["*"]>>
>;

export interface Dimension {
  width: number;
  height: number;
}

export interface UploadedContent {
  cid: string;
  preview_url: string;
  encrypted_url: string;
  dimension?: Dimension;
  cipherID: number;
  description: string;
}

export interface AddContentRequestBody {
  content: UploadedContent;
  ownerAddress: Address;
}
