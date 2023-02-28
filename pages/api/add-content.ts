import { AddContentRequestBody } from "@/lib/types";
import { getXataClient } from "@/xata";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { content, ownerAddress }: AddContentRequestBody = req.body;

  if (!content) {
    res.status(400).json({ error: "Missing content" });
    return;
  }
  try {
    const xata = getXataClient();
    const data = await xata.db.content.create({
      rootCid: content.cid,
      description: "",
      ownerAddress,
      createdAt: new Date().toISOString(),
      preview_url: content.preview_url,
      encrypted_url: content.encrypted_url,
      dimension: content.dimension || null,
      cipherId: content.cipherID,
    });
    res.status(201).json(data);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
    return;
  }
}
