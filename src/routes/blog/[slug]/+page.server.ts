import { db, schema } from '$lib/server/db';
import { eq, and, lte } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const now = new Date();

	const [post] = await db
		.select()
		.from(schema.blogPosts)
		.where(
			and(
				eq(schema.blogPosts.slug, params.slug),
				lte(schema.blogPosts.publishAt, now)
			)
		)
		.limit(1);

	if (!post) {
		error(404, 'Artykuł nie został znaleziony');
	}

	return {
		post: {
			...post,
			content: JSON.parse(post.content) as string[]
		}
	};
}
