import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['announcement', 'technical', 'analysis', 'spotlight', 'devlog']),
    tags: z.array(z.string()).optional(),
    author: z.string().default('Michael Lopez'),
    image: z.string().optional(),
    chartEmbed: z.string().optional(), // Path to embedded chart HTML
    featured: z.boolean().default(false), // Featured in carousel
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
