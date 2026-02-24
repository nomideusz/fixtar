import { PersistedState } from 'runed';

export type Language = 'en' | 'pl';

function createLanguageStore() {
	const persisted = new PersistedState<Language>('language', 'en', {
		storage: 'local',
		syncTabs: true,
	});

	return {
		get current() {
			return persisted.current;
		},
		set current(lang: Language) {
			persisted.current = lang;
		},
		toggle() {
			persisted.current = persisted.current === 'en' ? 'pl' : 'en';
		},
	};
}

export const languageStore = createLanguageStore();
