import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./blog",
  }),
  schema: ({ image }) => z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publishedDate: z.date(),
    editedDate: z.date().optional(),
    ogImage: image().optional(),
  }),
});

export const collections = { blog };
