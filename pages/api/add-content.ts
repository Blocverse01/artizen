import { Dimension } from "@/lib/types";
import { getXataClient } from "@/xata";
import { NextApiRequest, NextApiResponse } from "next";

type UploadedContent = {
  cid: string;
  preview_url: string;
  encrypted_url: string;
  dimension?: Dimension;
};

interface RequestBody {
  content: Array<UploadedContent>;
  ownerAddress: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, ownerAddress }: RequestBody = req.body;

  if (!content) {
    res.status(400).json({ error: "Missing content" });
    return;
  }
  try {
    const xata = getXataClient();
    const data = await xata.db.content.create(
      content.map((item) => ({
        rootCid: item.cid,
        description:
          "Lorem Ipsum Dolor Sit Amet, Lorem Ipsum Dolor Sit Amet, Lorem Ipsum Dolor Sit Amet.",
        ownerAddress,
        createdAt: new Date().toISOString(),
        preview_url: item.preview_url,
        encrypted_url: item.encrypted_url,
        dimension: item.dimension || null,
      }))
    );
    res.status(201).json(data);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
    return;
  }
}
