// Generated by Xata Codegen 0.21.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "content",
    columns: [
      { name: "rootCid", type: "string" },
      { name: "ownerAddress", type: "string" },
      { name: "createdAt", type: "datetime" },
      { name: "description", type: "text" },
      { name: "preview_url", type: "string" },
      { name: "encrypted_url", type: "string" },
      {
        name: "dimension",
        type: "object",
        columns: [
          { name: "width", type: "int" },
          { name: "height", type: "int" },
        ],
      },
      { name: "cipherId", type: "int" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Content = InferredTypes["content"];
export type ContentRecord = Content & XataRecord;

export type DatabaseSchema = {
  content: ContentRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL: "https://Blocverse-ext-b2u95r.us-east-1.xata.sh/db/artizen",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
