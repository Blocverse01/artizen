import { EXPLORE_PAGE_SIZE } from "@/lib/constants";
import { FetchedContentRecord } from "@/lib/types";
import { getXataClient } from "@/xata";
import { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  page?: number;
  search?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const xata = getXataClient();
    const { query } = req;
    const { page, search } = query as RequestBody;
    const offset = page ? (page - 1) * EXPLORE_PAGE_SIZE : 0;
    console.log({ page, search, offset });

    let content: FetchedContentRecord[];

    if (search) {
      console.log("search");
      content = await xata.db.content.search(search as string, {
        target: ["description"],
        page: {
          size: EXPLORE_PAGE_SIZE,
          offset,
        },
      });
    } else {
      console.log("no search");
      content = (
        await xata.db.content.getPaginated({
          pagination: {
            size: EXPLORE_PAGE_SIZE,
            offset,
          },
        })
      ).records;
    }
    res.status(200).json(content);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
    return;
  }
}
