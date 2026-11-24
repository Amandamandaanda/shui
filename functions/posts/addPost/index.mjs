
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { randomUUID } from "node:crypto";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { authenticate } from "../../../middlewares/authenticate.mjs";
import { validateToBody } from "../../../middlewares/validation.mjs";
import { postSchema } from "../../../models/posts.mjs";

export const handler = middy(async (event) => {

    const { title, content } = event.body;
    const username = event.user.username;

    const now = new Date().toISOString();
    const id = randomUUID();

    const post = {
        id,
        username,
        isGuest: false,
        title,
        content,
        feedKey: "POSTS",
        createdAt: now,
        updatedAt: now,
        createdAtId: `${now}#${id}`,
    };


    await db.send(
        new PutCommand({
        TableName: process.env.POSTS_TABLE,
        Item: post,
    })
  );


  return sendResponse(201, {
    message: "Post created successfully",
    post,
  });
})
.use(httpJsonBodyParser())
.use(validateToBody(postSchema))
.use(authenticate())
.use(errorHandler());
