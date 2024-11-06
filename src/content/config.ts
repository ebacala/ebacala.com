import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({ 
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.date(),
        edited: z.date().optional()
    }),
 });

export const collections = {
  'blog': blogCollection,
};