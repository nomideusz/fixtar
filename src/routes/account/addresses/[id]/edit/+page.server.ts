import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { userAddress } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) {
		throw redirect(302, '/auth/login');
	}

	const [address] = await db
		.select()
		.from(userAddress)
		.where(and(eq(userAddress.id, params.id), eq(userAddress.userId, locals.user.id)));

	return {
		user: locals.user,
		address: address
			? {
					id: address.id,
					type: address.type,
					street: address.street,
					city: address.city,
					postalCode: address.postalCode,
					country: address.country,
					default: address.isDefault
				}
			: null,
		id: params.id
	};
};

export const actions: Actions = {
	updateAddress: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Nieautoryzowany' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { message: 'Brak ID adresu' });

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

		// If setting as default, clear existing defaults
		if (isDefault) {
			await db
				.update(userAddress)
				.set({ isDefault: false, updatedAt: now })
				.where(eq(userAddress.userId, locals.user.id));
		}

		await db
			.update(userAddress)
			.set({ type, street, city, postalCode, country, isDefault, updatedAt: now })
			.where(and(eq(userAddress.id, id), eq(userAddress.userId, locals.user.id)));

		return { success: true };
	},

	deleteAddress: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Nieautoryzowany' });

		const data = await request.formData();
		const id = data.get('id')?.toString();
		if (!id) return fail(400, { message: 'Brak ID adresu' });

		await db
			.delete(userAddress)
			.where(and(eq(userAddress.id, id), eq(userAddress.userId, locals.user.id)));

		throw redirect(303, '/account/addresses');
	}
};
