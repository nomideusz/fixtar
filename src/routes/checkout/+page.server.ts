import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { orders, userAddress, shippingMethods as shippingMethodsTable } from '$lib/server/schema';
import { eq, asc } from 'drizzle-orm';
import { PaymentService } from '$lib/services/payment';
import { getBaseLinkerService } from '$lib/services/baselinker';

const VOIVODESHIPS = [
	'dolnośląskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie', 'łódzkie',
	'małopolskie', 'mazowieckie', 'opolskie', 'podkarpackie', 'podlaskie',
	'pomorskie', 'śląskie', 'świętokrzyskie', 'warmińsko-mazurskie',
	'wielkopolskie', 'zachodniopomorskie'
];

const paymentService = new PaymentService();

async function getShippingMethods() {
	const methods = await db
		.select()
		.from(shippingMethodsTable)
		.where(eq(shippingMethodsTable.enabled, true))
		.orderBy(asc(shippingMethodsTable.sortOrder));

	return methods.map((m) => ({
		id: m.id,
		name: m.name,
		description: m.description || '',
		cost: m.cost / 100,
		estimatedDeliveryDays: m.estimatedDays,
		freeShippingThreshold: m.freeShippingThreshold ? m.freeShippingThreshold / 100 : undefined
	}));
}

function getPaymentMethods() {
	const methods = [];

	if (paymentService.isP24Available) {
		methods.push(
			{
				id: 'p24-blik',
				code: 'blik',
				name: 'BLIK',
				description: 'Szybka płatność kodem BLIK'
			},
			{
				id: 'p24-card',
				code: 'card',
				name: 'Karta płatnicza',
				description: 'Visa, Mastercard, Google Pay, Apple Pay'
			},
			{
				id: 'p24-transfer',
				code: 'przelewy24',
				name: 'Przelew online',
				description: 'Przelewy24 — szybki przelew z Twojego banku'
			}
		);
	}

	methods.push({
		id: 'cod',
		code: 'cod',
		name: 'Płatność przy odbiorze',
		description: 'Zapłać kurierowi gotówką lub kartą',
		processingFee: 5,
		feeType: 'fixed' as const
	});

	return methods;
}

export const load = (async ({ locals }) => {
	const user = locals.user;

	let addresses: Array<{ default?: boolean; street?: string; city?: string; postalCode?: string }> = [];
	if (user) {
		const userAddresses = await db
			.select()
			.from(userAddress)
			.where(eq(userAddress.userId, user.id));
		addresses = userAddresses.map((a) => ({
			default: a.isDefault,
			street: a.street,
			city: a.city,
			postalCode: a.postalCode
		}));
	}

	return {
		isAuthenticated: !!user,
		user: user || null,
		addresses,
		cartItems: [],
		shippingMethods: await getShippingMethods(),
		paymentMethods: getPaymentMethods(),
		voivodeships: VOIVODESHIPS
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	placeOrder: async ({ request, locals, url }) => {
		const data = await request.formData();

		// Parse fields
		const email = data.get('email')?.toString()?.trim() || '';
		const phone = data.get('phone')?.toString()?.trim() || '';
		const firstName = data.get('firstName')?.toString()?.trim() || '';
		const lastName = data.get('lastName')?.toString()?.trim() || '';
		const company = data.get('company')?.toString()?.trim() || '';
		const street = data.get('street')?.toString()?.trim() || '';
		const apartment = data.get('apartment')?.toString()?.trim() || '';
		const city = data.get('city')?.toString()?.trim() || '';
		const voivodeship = data.get('voivodeship')?.toString() || '';
		const postalCode = data.get('postalCode')?.toString()?.trim() || '';
		const nip = data.get('nip')?.toString()?.trim() || '';
		const paymentMethod = data.get('paymentMethod')?.toString() || '';
		const shippingMethod = data.get('shippingMethod')?.toString() || '';
		const notes = data.get('notes')?.toString()?.trim() || '';
		const itemsJson = data.get('items')?.toString() || '[]';
		const subtotal = parseFloat(data.get('subtotal')?.toString() || '0');
		const shippingCost = parseFloat(data.get('shippingCost')?.toString() || '0');
		const total = parseFloat(data.get('total')?.toString() || '0');

		// Validate
		if (!email || !email.includes('@')) return fail(400, { message: 'Podaj prawidłowy adres email', success: false });
		if (!firstName) return fail(400, { message: 'Imię jest wymagane', success: false });
		if (!lastName) return fail(400, { message: 'Nazwisko jest wymagane', success: false });
		if (!street) return fail(400, { message: 'Ulica jest wymagana', success: false });
		if (!city) return fail(400, { message: 'Miasto jest wymagane', success: false });
		if (!postalCode) return fail(400, { message: 'Kod pocztowy jest wymagany', success: false });
		if (!paymentMethod) return fail(400, { message: 'Wybierz metodę płatności', success: false });
		if (!shippingMethod) return fail(400, { message: 'Wybierz metodę dostawy', success: false });

		let items: Array<{ productId: string; name: string; price: number; quantity: number }>;
		try {
			items = JSON.parse(itemsJson);
		} catch {
			return fail(400, { message: 'Nieprawidłowe dane koszyka', success: false });
		}

		if (!items.length) return fail(400, { message: 'Koszyk jest pusty', success: false });

		// Generate order number
		const now = new Date();
		const orderNumber = `FT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
		const orderId = crypto.randomUUID();

		const fullStreet = apartment ? `${street} m. ${apartment}` : street;
		const shippingAddress = {
			fullName: `${firstName} ${lastName}`,
			company,
			street: fullStreet,
			city,
			voivodeship,
			postalCode,
			country: 'PL',
			nip
		};

		// Create order in DB (status: pending)
		await db.insert(orders).values({
			id: orderId,
			userId: locals.user?.id || null,
			orderNumber,
			status: 'pending',
			total: Math.round(total * 100),
			subtotal: Math.round(subtotal * 100),
			shippingCost: Math.round(shippingCost * 100),
			paymentMethod,
			shippingMethod,
			email,
			phone,
			shippingAddress: JSON.stringify(shippingAddress),
			items: JSON.stringify(items),
			userComments: notes || null,
			createdAt: now,
			updatedAt: now
		});

		// Save address if requested
		if (locals.user && data.get('saveAddress') === 'on') {
			await db.insert(userAddress).values({
				id: crypto.randomUUID(),
				userId: locals.user.id,
				type: 'Home',
				street: fullStreet,
				city,
				postalCode,
				country: 'PL',
				isDefault: false,
				createdAt: now,
				updatedAt: now
			});
		}

		// Process payment
		const origin = url.origin;
		const paymentResult = await paymentService.processPayment(paymentMethod, {
			orderId,
			orderNumber,
			amount: total,
			currency: 'PLN',
			email,
			description: `Zamówienie ${orderNumber} — FixTar`,
			customerData: { firstName, lastName, phone },
			returnUrl: `${origin}/checkout/success?order=${orderId}`,
			webhookUrl: `${origin}/api/webhooks/payment?provider=przelewy24`
		});

		if (!paymentResult.success) {
			// Update order to failed
			await db
				.update(orders)
				.set({ status: 'failed', updatedAt: new Date() })
				.where(eq(orders.id, orderId));

			return fail(400, {
				message: paymentResult.error || 'Nie udało się przetworzyć płatności.',
				success: false
			});
		}

		// Push order to BaseLinker (mock in dev — won't create real BL order)
		try {
			const blService = getBaseLinkerService();
			const blResult = await blService.pushOrder({
				orderNumber,
				email,
				phone,
				deliveryAddress: {
					fullName: `${firstName} ${lastName}`,
					street: fullStreet,
					city,
					postalCode,
					country: 'PL'
				},
				items: items.map((i) => ({
					name: i.name,
					price: i.price,
					quantity: i.quantity
				}))
			});

			if (blResult.baselinkerOrderId && blResult.baselinkerOrderId > 0) {
				await db
					.update(orders)
					.set({ baselinkerOrderId: blResult.baselinkerOrderId, updatedAt: new Date() })
					.where(eq(orders.id, orderId));
			}
		} catch (err) {
			console.error('[checkout] BaseLinker push failed (non-fatal):', err);
		}

		// If P24 redirect, send customer there
		if (paymentResult.redirectUrl) {
			await db
				.update(orders)
				.set({ status: 'processing', updatedAt: new Date() })
				.where(eq(orders.id, orderId));

			throw redirect(303, paymentResult.redirectUrl);
		}

		// For COD / bank transfer — mark as pending and go to success
		const finalStatus = paymentMethod === 'cod' ? 'processing' : 'pending';
		await db
			.update(orders)
			.set({ status: finalStatus, updatedAt: new Date() })
			.where(eq(orders.id, orderId));

		throw redirect(303, `/checkout/success?order=${orderId}`);
	}
};
