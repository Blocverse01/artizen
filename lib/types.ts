import { ContentRecord } from "@/xata";
import { SelectedPick } from "@xata.io/client";

export type FetchedContentRecord = Readonly<SelectedPick<ContentRecord, ["*"]>>;
