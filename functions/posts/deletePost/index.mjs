
import middy from "@middy/core";
import { GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { createError } from "@middy/util";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs";

export const handler = middy(async (event) => {

    const { postId } = event.pathParameters;

    const username = event.user.username;

    const result = await db.send(
        new GetCommand({

            TableName: process.env.POSTS_TABLE,
            Key: { id: postId },
        })
  );
  if (!result.Item) {
    throw createError(404, "Post not found");

  }

  if (result.Item.username !== username) {
    throw createError(403, "You are not allowed to delete this post");
  }

  await db.send(
    
    new DeleteCommand({
      TableName: process.env.POSTS_TABLE,
      Key: { id: postId },
    })

  );

  return sendResponse(204);
}).use(authenticate()).use(errorHandler());
