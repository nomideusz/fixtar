export interface Notification {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}

function createNotifications() {
	let items = $state<Notification[]>([]);

	function add(notification: Omit<Notification, 'id'>): string {
		const id = Math.random().toString(36).substring(2, 11);
		const entry: Notification = {
			...notification,
			id,
			duration: notification.duration ?? 5000,
		};

		items = [...items, entry];

		if (entry.duration && entry.duration > 0) {
			setTimeout(() => remove(id), entry.duration);
		}

		return id;
	}

	function remove(id: string) {
		items = items.filter((n) => n.id !== id);
	}

	return {
		get items() {
			return items;
		},

		success: (message: string, duration?: number) => add({ type: 'success', message, duration }),
		error: (message: string, duration?: number) => add({ type: 'error', message, duration }),
		warning: (message: string, duration?: number) => add({ type: 'warning', message, duration }),
		info: (message: string, duration?: number) => add({ type: 'info', message, duration }),
		remove,
		clear() {
			items = [];
		},
	};
}

export const notifications = createNotifications();
