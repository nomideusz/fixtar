import { db, schema } from '$lib/server/db';
import { desc, lte } from 'drizzle-orm';

export async function load() {
	const now = new Date();

	const posts = await db
		.select({
			slug: schema.blogPosts.slug,
			title: schema.blogPosts.title,
			description: schema.blogPosts.description,
			tag: schema.blogPosts.tag,
			publishAt: schema.blogPosts.publishAt
		})
		.from(schema.blogPosts)
		.where(lte(schema.blogPosts.publishAt, now))
		.orderBy(desc(schema.blogPosts.publishAt));

	return { posts };
}
