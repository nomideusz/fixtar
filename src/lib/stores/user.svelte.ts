import { PersistedState } from 'runed';

export interface User {
	id: string;
	username: string;
	email: string;
	isAdmin?: boolean;
	created?: string;
}

function createUserStore() {
	const persisted = new PersistedState<User | null>('user', null, {
		storage: 'local',
		syncTabs: true
	});

	const isAuthenticated = $derived(persisted.current !== null);

	return {
		get current() {
			return persisted.current;
		},
		get isAuthenticated() {
			return isAuthenticated;
		},

		login(user: User) {
			persisted.current = user;
		},

		logout() {
			persisted.current = null;
		},

		updateUser(updates: Partial<User>) {
			if (persisted.current) {
				persisted.current = { ...persisted.current, ...updates };
			}
		}
	};
}

export const userStore = createUserStore();
