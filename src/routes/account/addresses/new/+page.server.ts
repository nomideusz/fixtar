import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userAddress } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}
	return { user: locals.user };
};

export const actions: Actions = {
	addAddress: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Nieautoryzowany' });

		const data = await request.formData();
		const type = data.get('type')?.toString() || 'Home';
		const street = data.get('street')?.toString()?.trim();
		const city = data.get('city')?.toString()?.trim();
		const postalCode = data.get('postalCode')?.toString()?.trim();
		const country = data.get('country')?.toString();
		const isDefault = data.get('default') === 'true';

		if (!street) return fail(400, { message: 'Ulica jest wymagana' });
		if (!city) return fail(400, { message: 'Miasto jest wymagane' });
		if (!postalCode) return fail(400, { message: 'Kod pocztowy jest wymagany' });
		if (!country) return fail(400, { message: 'Kraj jest wymagany' });

		const now = new Date();
		const id = crypto.randomUUID();

		// If this will be default, clear existing defaults
		if (isDefault) {
			await db
				.update(userAddress)
				.set({ isDefault: false, updatedAt: now })
				.where(eq(userAddress.userId, locals.user.id));
		}

		// If user has no addresses yet, make this one default regardless
		const existing = await db
			.select({ id: userAddress.id })
			.from(userAddress)
			.where(eq(userAddress.userId, locals.user.id))
			.limit(1);

		const shouldBeDefault = isDefault || existing.length === 0;

		await db.insert(userAddress).values({
			id,
			userId: locals.user.id,
			type,
			street,
			city,
			postalCode,
			country,
			isDefault: shouldBeDefault,
			createdAt: now,
			updatedAt: now
		});

		return { success: true };
	}
};
