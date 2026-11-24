
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { authenticate } from "../../../middlewares/authenticate.mjs";
import { createError } from "@middy/util";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { validateToBody } from "../../../middlewares/validation.mjs";
import { postSchema } from "../../../models/posts.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";


export const handler = middy(async (event) => {

    const { postId } = event.pathParameters;
    const { title, content } = event.body;
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
    throw createError(403, "You are not allowed to update this post");
  }

  const updatedAt = new Date().toISOString();

  const updateResult = await db.send(
    new UpdateCommand({
        TableName: process.env.POSTS_TABLE,
        Key: { id: postId },
        UpdateExpression: "SET title = :title, content = :content, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
            ":title": title,
            ":content": content,
            ":updatedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",

    })
  );

  return sendResponse(200, {
    message: "Post updated successfully",
    post: updateResult.Attributes,
  });
})
  .use(httpJsonBodyParser())
  .use(validateToBody(postSchema))
  .use(authenticate())
  .use(errorHandler());
