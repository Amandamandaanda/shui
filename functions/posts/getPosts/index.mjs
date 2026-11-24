import middy from "@middy/core";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { postsQuerySchema } from "../../../models/posts.mjs";
import { createError } from "@middy/util";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export const handler = middy(async (event) => {

  const query = event.queryStringParameters ?? {};
  const result = postsQuerySchema.safeParse(query);

  if (!result.success) {
    throw createError(400, result.error.issues[0].message);

  }

  const { username } = result.data;


  const postsResult = await db.send(new QueryCommand({
    TableName: process.env.POSTS_TABLE,
    IndexName: "posts-by-date-index",
    KeyConditionExpression: "feedKey = :feedKey",
    ExpressionAttributeValues: {
      ":feedKey": "POSTS",
    },
    ScanIndexForward: false,
  }));

  const posts = postsResult.Items ?? [];

  const filteredPosts = username
    ? posts.filter((post) => post.username === username)
    : posts;
  filteredPosts.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );


  return sendResponse(200, filteredPosts);
}).use(errorHandler());