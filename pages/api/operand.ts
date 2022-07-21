import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  Object,
  OperandV3,
  SearchVariantContentsResponse,
} from "@operandinc/sdk";
import { operand } from "../../lib/operand";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, link } = req.query;

  if (!link) {
    res.status(400).json({
      error: "No link provided.",
    });
    return;
  }

  if (!query) {
    res.status(400).json({
      error: "No query provided.",
    });
    return;
  }

  const obj = await prisma.link.findUnique({
    where: {
      id: link as string,
    },
  });

  if (!obj) {
    res.status(400).json({
      error: "No link found.",
    });
    return;
  }

  // Perform a filtered search
  const results = await operand.searchContents({
    query: query as string,
    parentIds: [obj.operandObjectId],
    max: 10,
  });

  if (!results) {
    res.status(400).json({
      error: "No search results found.",
    });
    return;
  }

  res.status(200).json(results);
}
