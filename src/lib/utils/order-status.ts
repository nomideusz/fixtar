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
	shipped: { label: 'Wysłano', colorClass: 'bg-[--ft-frost] text-[--ft-accent]' },
	shipping: { label: 'Wysłano', colorClass: 'bg-[--ft-frost] text-[--ft-accent]' },
	processing: { label: 'Przetwarzane', colorClass: 'bg-warning/10 text-warning-dark' },
	pending: { label: 'Przetwarzane', colorClass: 'bg-warning/10 text-warning-dark' },
	cancelled: { label: 'Anulowano', colorClass: 'bg-danger/10 text-danger-dark' }
};

const DEFAULT_STATUS: OrderStatusInfo = {
	label: 'Nieznany',
	colorClass: 'bg-[--ft-frost] text-[--ft-text-muted]'
};

export function getOrderStatus(status: string): OrderStatusInfo {
	return STATUS_MAP[status.toLowerCase()] || DEFAULT_STATUS;
}
