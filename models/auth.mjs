import { z } from "zod";

export const registerSchema = z.object({

  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),

});

export const loginSchema = z.object({

  username: z.string().trim().min(1, "Username is required"),
  password: z.string().trim().min(1, "Password is required"),
});