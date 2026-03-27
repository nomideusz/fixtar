import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userAddress } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const addresses = await db
		.select()
		.from(userAddress)
		.where(eq(userAddress.userId, locals.user.id));

	return {
		user: locals.user,
		addresses: addresses.map((a) => ({
			id: a.id,
			type: a.type,
			street: a.street,
			city: a.city,
			postalCode: a.postalCode,
			country: a.country,
			default: a.isDefault
		}))
	};
};

export const actions: Actions = {
	removeAddress: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Nieautoryzowany' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { message: 'Brak ID adresu' });

		const [address] = await db
			.select()
			.from(userAddress)
			.where(and(eq(userAddress.id, id), eq(userAddress.userId, locals.user.id)));

		if (!address) return fail(404, { message: 'Adres nie znaleziony' });

		await db
			.delete(userAddress)
			.where(and(eq(userAddress.id, id), eq(userAddress.userId, locals.user.id)));

		// If deleted address was default, make the first remaining one default
		if (address.isDefault) {
			const remaining = await db
				.select()
				.from(userAddress)
				.where(eq(userAddress.userId, locals.user.id))
				.limit(1);

			if (remaining.length > 0) {
				await db
					.update(userAddress)
					.set({ isDefault: true, updatedAt: new Date() })
					.where(eq(userAddress.id, remaining[0].id));
			}
		}

		return { success: true };
	},

	setDefault: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Nieautoryzowany' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { message: 'Brak ID adresu' });

		// Clear all defaults for this user
		await db
			.update(userAddress)
			.set({ isDefault: false, updatedAt: new Date() })
			.where(eq(userAddress.userId, locals.user.id));

		// Set the new default
		await db
			.update(userAddress)
			.set({ isDefault: true, updatedAt: new Date() })
			.where(and(eq(userAddress.id, id), eq(userAddress.userId, locals.user.id)));

		return { success: true };
	}
};
