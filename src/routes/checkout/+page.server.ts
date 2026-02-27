import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const VOIVODESHIPS = [
	'dolnośląskie',
	'kujawsko-pomorskie',
	'lubelskie',
	'lubuskie',
	'łódzkie',
	'małopolskie',
	'mazowieckie',
	'opolskie',
	'podkarpackie',
	'podlaskie',
	'pomorskie',
	'śląskie',
	'świętokrzyskie',
	'warmińsko-mazurskie',
	'wielkopolskie',
	'zachodniopomorskie'
];

interface ShippingMethod {
	id: string;
	name: string;
	description: string;
	cost: number;
	estimatedDeliveryDays?: number;
	freeShippingThreshold?: number;
}

interface PaymentMethod {
	id: string;
	code: string;
	name: string;
	description: string;
	processingFee?: number;
	feeType?: 'fixed' | 'percentage';
}

export const load = (async ({ locals }) => {
	const user = locals.user;

	// TODO: Implement checkout with BaseLinker/payment provider
	return {
		isAuthenticated: !!user,
		user: user || null,
		addresses: [] as Array<{
			default?: boolean;
			street?: string;
			city?: string;
			postalCode?: string;
		}>,
		cartItems: [],
		shippingMethods: [] as ShippingMethod[],
		paymentMethods: [] as PaymentMethod[],
		voivodeships: VOIVODESHIPS
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	placeOrder: async () => {
		// TODO: Implement order placement
		return fail(500, { message: 'Checkout not yet implemented', success: false, redirectUrl: '' });
	}
};
