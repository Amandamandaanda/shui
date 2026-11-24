
import { z } from "zod";


export const postSchema = z.object({

    title: z.string().trim().min(1, "Title is required"),
     content: z.string().trim().min(1, "Content is required"),
});

export const postQuerySchema = z.object({
    username: z.string().trim().min(1, "Username cannot be empty").optional(),
});