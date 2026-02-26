// Translation keys used across the application
export type TranslationKey =
	| 'yourCart'
	| 'remove'
	| 'clearCart'
	| 'closeCartDrawer'
	| 'cartEmpty'
	| 'browseProducts'
	| 'decreaseQuantity'
	| 'increaseQuantity'
	| 'subtotal'
	| 'shippingNote'
	| 'proceedToCheckout'
	| 'continueShopping'
	| string;

export type TranslationMap = Record<TranslationKey, string>;

export const translations: Record<string, TranslationMap> = {
	en: {
		yourCart: 'Your Cart',
		remove: 'Remove',
		clearCart: 'Clear cart',
		closeCartDrawer: 'Close cart drawer',
		cartEmpty: 'Your cart is empty',
		browseProducts: 'Browse Products',
		decreaseQuantity: 'Decrease quantity',
		increaseQuantity: 'Increase quantity',
		subtotal: 'Subtotal',
		shippingNote: 'Shipping and taxes calculated at checkout.',
		proceedToCheckout: 'Proceed to Checkout',
		continueShopping: 'Continue Shopping'
	},
	pl: {
		yourCart: 'Twój koszyk',
		remove: 'Usuń',
		clearCart: 'Wyczyść koszyk',
		closeCartDrawer: 'Zamknij szufladę koszyka',
		cartEmpty: 'Twój koszyk jest pusty',
		browseProducts: 'Przeglądaj produkty',
		decreaseQuantity: 'Zmniejsz ilość',
		increaseQuantity: 'Zwiększ ilość',
		subtotal: 'Suma częściowa',
		shippingNote: 'Wysyłka i podatki obliczane przy kasie.',
		proceedToCheckout: 'Przejdź do kasy',
		continueShopping: 'Kontynuuj zakupy'
	}
};
