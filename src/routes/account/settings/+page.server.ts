import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { userProfile, userPreferences } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.isAuthenticated || !locals.user) {
		throw redirect(302, '/auth/login');
	}

	const [profile] = await db
		.select()
		.from(userProfile)
		.where(eq(userProfile.userId, locals.user.id));

	const [preferences] = await db
		.select()
		.from(userPreferences)
		.where(eq(userPreferences.userId, locals.user.id));

	return {
		user: {
			id: locals.user.id,
			name: locals.user.name || '',
			email: locals.user.email || '',
			emailVerified: locals.user.emailVerified || false,
			image: locals.user.image || null,
			createdAt: locals.user.createdAt,
			updatedAt: locals.user.updatedAt,
			username: locals.user.name || '',
			firstName: profile?.firstName || '',
			lastName: profile?.lastName || '',
			phone: profile?.phone || '',
			company: profile?.company || '',
			preferences: preferences
				? {
						emailNotifications: preferences.emailNotifications,
						smsNotifications: preferences.smsNotifications,
						marketingEmails: preferences.marketingEmails,
						orderUpdates: preferences.orderUpdates,
						newsletter: preferences.newsletter,
						language: preferences.language,
						currency: preferences.currency,
						theme: preferences.theme
					}
				: null
		}
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Nieautoryzowany' });
		}

		const data = await request.formData();
		const username = data.get('username')?.toString()?.trim() || '';
		const firstName = data.get('firstName')?.toString()?.trim() || '';
		const lastName = data.get('lastName')?.toString()?.trim() || '';
		const phone = data.get('phone')?.toString()?.trim() || '';
		const company = data.get('company')?.toString()?.trim() || '';

		if (username && username.length < 3) {
			return fail(400, { message: 'Nazwa użytkownika musi mieć co najmniej 3 znaki' });
		}

		const now = new Date();

		try {
			// Update name in better-auth user table
			if (username) {
				await auth.api.updateUser({
					body: { name: username },
					headers: request.headers
				});
			}

			// Upsert profile
			const [existing] = await db
				.select()
				.from(userProfile)
				.where(eq(userProfile.userId, locals.user.id));

			if (existing) {
				await db
					.update(userProfile)
					.set({ firstName, lastName, phone, company, updatedAt: now })
					.where(eq(userProfile.userId, locals.user.id));
			} else {
				await db.insert(userProfile).values({
					id: crypto.randomUUID(),
					userId: locals.user.id,
					firstName,
					lastName,
					phone,
					company,
					createdAt: now,
					updatedAt: now
				});
			}

			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.body?.message || 'Nie udało się zaktualizować profilu' });
		}
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Nieautoryzowany' });
		}

		const data = await request.formData();
		const currentPassword = data.get('currentPassword')?.toString() || '';
		const newPassword = data.get('newPassword')?.toString() || '';
		const confirmPassword = data.get('confirmPassword')?.toString() || '';

		if (newPassword !== confirmPassword) {
			return fail(400, { message: 'Hasła się nie zgadzają' });
		}

		if (newPassword.length < 8) {
			return fail(400, { message: 'Hasło musi mieć co najmniej 8 znaków' });
		}

		try {
			await auth.api.changePassword({
				body: { currentPassword, newPassword, revokeOtherSessions: true },
				headers: request.headers
			});
			return { success: true };
		} catch (err: any) {
			return fail(400, { message: err?.body?.message || 'Nie udało się zmienić hasła' });
		}
	},

	updateNotifications: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Nieautoryzowany' });
		}

		const data = await request.formData();
		const orderUpdates = data.has('orderUpdates');
		const marketingEmails = data.has('marketingEmails');
		const newsletter = data.has('newsletter');
		const smsNotifications = data.has('smsNotifications');

		const now = new Date();

		const [existing] = await db
			.select()
			.from(userPreferences)
			.where(eq(userPreferences.userId, locals.user.id));

		if (existing) {
			await db
				.update(userPreferences)
				.set({ orderUpdates, marketingEmails, newsletter, smsNotifications, updatedAt: now })
				.where(eq(userPreferences.userId, locals.user.id));
		} else {
			await db.insert(userPreferences).values({
				id: crypto.randomUUID(),
				userId: locals.user.id,
				orderUpdates,
				marketingEmails,
				newsletter,
				smsNotifications,
				emailNotifications: true,
				language: 'pl',
				currency: 'PLN',
				theme: 'light',
				createdAt: now,
				updatedAt: now
			});
		}

		return { success: true };
	},

	updatePreferences: async ({ request, locals }) => {
		if (!locals.isAuthenticated || !locals.user?.id) {
			return fail(401, { message: 'Nieautoryzowany' });
		}

		const data = await request.formData();
		const language = data.get('language')?.toString() || 'pl';
		const currency = data.get('currency')?.toString() || 'PLN';
		const theme = data.get('theme')?.toString() || 'light';

		const now = new Date();

		const [existing] = await db
			.select()
			.from(userPreferences)
			.where(eq(userPreferences.userId, locals.user.id));

		if (existing) {
			await db
				.update(userPreferences)
				.set({ language, currency, theme, updatedAt: now })
				.where(eq(userPreferences.userId, locals.user.id));
		} else {
			await db.insert(userPreferences).values({
				id: crypto.randomUUID(),
				userId: locals.user.id,
				language,
				currency,
				theme,
				emailNotifications: true,
				smsNotifications: false,
				marketingEmails: true,
				orderUpdates: true,
				newsletter: false,
				createdAt: now,
				updatedAt: now
			});
		}

		return { success: true };
	}
};
