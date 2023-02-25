import { ContentRecord } from "@/xata";
import { RecordArray, SelectedPick } from "@xata.io/client";

export type FetchedContentRecord = Readonly<SelectedPick<ContentRecord, ["*"]>>;
export type PaginatedContentRecords = RecordArray<
  Readonly<SelectedPick<ContentRecord, ["*"]>>
>;

export interface Dimension {
  width: number;
  height: number;
}
