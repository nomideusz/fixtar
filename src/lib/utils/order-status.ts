/**
 * Order status utilities — shared across account, orders, and admin pages.
 */

interface OrderStatusInfo {
	label: string;
	colorClass: string;
}

const STATUS_MAP: Record<string, OrderStatusInfo> = {
	delivered: { label: 'Dostarczono', colorClass: 'bg-success/10 text-success-dark' },
	completed: { label: 'Dostarczono', colorClass: 'bg-success/10 text-success-dark' },
	shipped: { label: 'Wysłano', colorClass: 'bg-brand-100 text-brand-800' },
	shipping: { label: 'Wysłano', colorClass: 'bg-brand-100 text-brand-800' },
	processing: { label: 'Przetwarzane', colorClass: 'bg-warning/10 text-warning-dark' },
	pending: { label: 'Przetwarzane', colorClass: 'bg-warning/10 text-warning-dark' },
	cancelled: { label: 'Anulowano', colorClass: 'bg-danger/10 text-danger-dark' }
};

const DEFAULT_STATUS: OrderStatusInfo = {
	label: 'Nieznany',
	colorClass: 'bg-neutral-100 text-neutral-200'
};

export function getOrderStatus(status: string): OrderStatusInfo {
	return STATUS_MAP[status.toLowerCase()] || DEFAULT_STATUS;
}
