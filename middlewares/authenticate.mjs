
import createError from "http-errors";
import { verifyToken } from "../utils/jwt.mjs";

export const authenticate = () => ({
  before: (handler) => {
    const authHeader = handler.event.headers?.authorization;

    if (!authHeader) {
      throw createError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw createError(401, "Token missing");
    }

    try {
      const user = verifyToken(token);
      handler.event.user = user;
    } catch (error) {
      throw createError(401, "Invalid token");
    }
  },
});
