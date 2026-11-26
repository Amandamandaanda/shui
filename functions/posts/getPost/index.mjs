
import middy from "@middy/core";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { createError } from "@middy/util";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {
  const { postId } = event.pathParameters;
  const result = await db.send(
    new GetCommand({
      TableName: process.env.POSTS_TABLE,
      Key: {
        id: postId,
      },
    }));

  if (!result.Item) {

    throw createError(404, "Post not found");
  }

  const post = {
    id: result.Item.id,
    username: result.Item.username,
    isGuest: result.Item.isGuest,
    title: result.Item.title,
    content: result.Item.content,
    createdAt: result.Item.createdAt,
    updatedAt: result.Item.updatedAt,
  }


  return sendResponse(200, post);
}).use(errorHandler());
