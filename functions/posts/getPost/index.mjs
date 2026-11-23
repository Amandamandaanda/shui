
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

  
  return sendResponse(200, result.Item);
}).use(errorHandler());
