import prisma from "../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get the link from the query
  const { link } = req.query;

  if (!link) {
    res.status(400).json({
      error: "No link provided.",
    });
    return;
  }

  // Get the object from Operand
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

  // Return relevent data
  res.status(200).json({
    name: obj.workspaceName,
    icon: obj.workspaceIcon,
    id: obj.workspaceId,
  });
}
