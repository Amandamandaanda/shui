
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { createError } from "@middy/util";
import { addUser } from "../../../services/users.mjs";
import { hashPassword } from "../../../utils/bcrypt.mjs";
import { sendResponse } from "../../../responses/index.mjs";
import { errorHandler } from "../../../middlewares/errorHandler.mjs";
import { registerSchema } from "../../../models/auth.mjs";

export const handler = middy(async (event) => {

  const result = registerSchema.safeParse(event.body);

  if (!result.success) {
    throw createError(400, result.error.issues[0].message);
  }

  const { username, password } = result.data;
  const passwordHash = await hashPassword(password);

  const user = await addUser({
    username,
    passwordHash,

  });

  return sendResponse(201, {
    message: "User registered successfully",
    username: user.username,
  });
  
})
  .use(httpJsonBodyParser())
  .use(errorHandler());

