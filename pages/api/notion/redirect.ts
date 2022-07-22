import prisma from "../../../lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import base64 from "base-64";
import { operand } from "../../../lib/operand";

const searchMyNotionRootId = process.env.OPERAND_NOTION_COLLECTION_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query as {
    code: string;
  };

  if (!code) {
    res.status(400).json({
      error: "No code provided.",
    });
    return;
  }

  const response = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64.encode(
        `${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
      )}`,
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/notion/redirect`,
    }),
  });

  const json = (await response.json()) as {
    access_token: string;
    workspace_id: string;
    workspace_name?: string;
    workspace_icon?: string;
    bot_id: string;
    owner?: {
      type: string;
      user: {
        object: string;
        id: string;
        name?: string;
        avatar_url?: string;
        type?: string;
        person?: {
          email: string;
        };
      };
    };
  };

  if (!json.access_token) {
    res.status(500).json({
      error: "Failed to exchange access token.",
    });
    return;
  }

  if (!json.owner) {
    res.status(500).json({
      error: "Failed to get owner.",
    });
    return;
  }

  if (
    !json.owner.type ||
    json.owner.type !== "user" ||
    !json.owner.user.type ||
    json.owner.user.type !== "person" ||
    !json.owner.user.person
  ) {
    res.status(500).json({
      error: "Owner is not a user.",
    });
    return;
  }

  // Create or update user
  const user = await prisma.user.upsert({
    where: {
      email: json.owner.user.person.email,
    },
    update: {
      id: json.owner.user.id,
      name: json.owner.user.name,
      avatarUrl: json.owner.user.avatar_url,
      email: json.owner.user.person.email,
    },
    create: {
      id: json.owner.user.id,
      name: json.owner.user.name,
      avatarUrl: json.owner.user.avatar_url,
      email: json.owner.user.person.email,
    },
  });

  try {
    const notion = await operand.createObject({
      type: "notion",
      metadata: {
        accessToken: json.access_token,
      },
      parentId: searchMyNotionRootId,
      properties: {
        workspace_id: json.workspace_id,
        workspace_name: json.workspace_name || undefined,
      },
      label: json.owner.user.person.email,
    });

    // Create a link for the user
    const link = await prisma.link.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        acesssToken: json.access_token,
        operandObjectId: notion.id,
        objectStatus: notion.indexingStatus as string,
        workspaceId: json.workspace_id,
        workspaceName: json.workspace_name,
        workspaceIcon: json.workspace_icon,
      },
    });

    // Redirect to the callback page
    res
      .status(302)
      .setHeader(
        "Location",
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/callback`
      );
    res.end();
  } catch (e) {
    console.log(e);
  }
}
