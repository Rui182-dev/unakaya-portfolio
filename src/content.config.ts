import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const works = defineCollection({
	loader: glob({ base: './src/content/works', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			subtitle: z.string().optional(),
			category: z.enum(['personal', 'commercial', 'team', 'tool', 'rnd']),
			layoutVariant: z.enum(['default', 'editorial']).optional(),
			featured: z.boolean().default(false),
			order: z.number(),
			year: z.string(),
			role: z.string(),
			software: z.array(z.string()),
			techniques: z.array(z.string()).default([]),
			summary: z.string(),
			projectContext: z.string().optional(),
			officialLink: z.string().optional(),
			officialLinkLabel: z.string().default('Official Video'),
			officialLinkNote: z.string().optional(),
			technicalFocus: z.string().optional(),
			contribution: z.array(z.string()).default([]),
			gallery: z.array(image()).default([]),
			additionalNotes: z.string().optional(),
			thumbnail: image(),
			video: z.string().optional(),
			localVideo: z.string().optional(),
			poster: z.string().optional(),
		}),
});

export const collections = { works };
