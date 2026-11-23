
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import createError from "http-errors";
import db from "./db.mjs";

export const addUser = async ({ username, passwordHash }) => {
  try {
    await db.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: {
          username,
          passwordHash,
        },
        ConditionExpression: "attribute_not_exists(username)",
      })
    );

    return { username };
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      throw createError(409, "Username already exists");
    }

    console.log("Error creating user:", error);
    throw createError(500, "Could not create user");
  }
};

export const getUserByUsername = async (username) => {
  try {
    const result = await db.send(
      new GetCommand({
        TableName: process.env.USERS_TABLE,
        Key: {
          username,
        },
      })
    );

    return result.Item;
  } catch (error) {
    console.log("Error getting user:", error);
    throw createError(500, "Could not get user");
  }
};
