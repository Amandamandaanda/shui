
import middy from "@middy/core";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import db from "../../../services/db.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {

    const result = await db.send(
        new ScanCommand({
        TableName: process.env.POSTS_TABLE,
    })

  );

  const posts = result.Items ?? [];
  const username = event.queryStringParameters?.username;

  const filteredPosts = username ? posts.filter((post) => post.username === username) : posts;

  filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);


  return sendResponse(200, filteredPosts);
})
  .use(errorHandler());
