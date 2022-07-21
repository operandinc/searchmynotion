import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { operand } from "../../../lib/operand";
import { Link } from "@prisma/client";
import { ServerClient } from "postmark";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get headers from request
  const { authorization: authorization } = req.headers;
  if (!authorization) {
    res.status(400).json({
      error: "No authorization provided.",
    });
    return;
  }

  if (authorization != (process.env.AUTHORIZATION_CODE as string)) {
    res.status(400).json({
      error: "Invalid authorization code.",
    });
    return;
  }

  // Get all of the Links which have the status of indexing
  const links = await prisma.link.findMany({
    where: {
      objectStatus: "indexing",
    },
  });

  // Then for each object check Operand to see if the status has changed
  // Ready link array
  const ready: Link[] = [];
  // Error link array
  const error: Link[] = [];
  // For each link
  for (const link of links) {
    // Get the object from Operand
    const object = await operand.getObject({
      id: link.operandObjectId,
    });
    // If the object is not found, set the status to "not found"
    if (!object) {
      await prisma.link.update({
        where: {
          id: link.id,
        },
        data: {
          objectStatus: "error",
        },
      });
    } else {
      // If the object is found, check if the status has changed
      if (object.indexingStatus !== link.objectStatus) {
        // If the status has changed, update the database
        // Object status is now error or ready
        await prisma.link.update({
          where: {
            id: link.id,
          },
          data: {
            objectStatus: object.indexingStatus,
          },
        });
        if (object.indexingStatus === "ready") {
          ready.push(link);
        } else if (object.indexingStatus === "error") {
          error.push(link);
        }
      }
    }
  }
  const serverToken = process.env.POSTMARK_SERVER_TOKEN as string;

  // Create postmark client
  const client = new ServerClient(serverToken);

  // Now lets email the user if their link is ready
  for (const link of ready) {
    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        id: link.userId,
      },
    });
    if (!user) {
      continue;
    }
    // Send email
    await client.sendEmail({
      From: "searchmynotion@operand.ai",
      To: user.email,
      Subject: "Your searchmynotion link is ready!",
      TextBody: `Your searchmynotion link is ready!\n\n${process.env.NEXT_PUBLIC_FRONTEND_URL}/search?link=${link.id}`,
    });
  }
  // Now lets email the user if their link is error
  for (const link of error) {
    // Get the user
    const user = await prisma.user.findUnique({
      where: {
        id: link.userId,
      },
    });
    if (!user) {
      continue;
    }
    // Send email
    await client.sendEmail({
      From: "searchmynotion@operand.ai",
      To: user.email,
      Subject: "Your searchmynotion indexing failed!",
      TextBody: `Sorry but we were unable to index your Notion. Apologies for the inconvenience and we are working on a fix.`,
    });
  }
  // Return success
  res.status(200).json({
    success: true,
  });
}
