
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { addUser } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";

export const handler = middy(async (event) => {
  const { username, password } = event.body;

  if (!username || !password) {
    throw createError(400, "Username and password are required");
  }

  const passwordHash = await hashPassword(password);

  const user = await addUser({
    username,
    passwordHash,
    
  });

  return sendResponse(201, {
    message: "User created",
    username: user.username,
  });
})
  .use(httpJsonBodyParser())
  .use(errorHandler());
