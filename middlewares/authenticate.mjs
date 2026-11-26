
import createError from "http-errors";
import { verifyToken } from "../utils/jwt.mjs";

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

export const authenticate = () => ({
  before: (handler) => {
    const authHeader = handler.event.headers?.authorization ??
    handler.event.headers?.Authorization;

    if (!authHeader) {
      throw createError(401, "Authorization header missing");
    }

    const match = authHeader.match(BEARER_PATTERN);

    if (!match) {
      throw createError(401, "Invalid authorization format");
    }

    try {
      const user = verifyToken(match[1]);
      if (typeof user.username !== "string") {
        throw createError(401, "Invalid token");
      }
      handler.event.user = { 
        username: user.username,
      };
    } catch (error) {
        if (error.statusCode === 401) {
            throw error
    }
    if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
    }
    throw createError(401, "Invalid token");
  }
},
});
