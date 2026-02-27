import { PersistedState } from 'runed';

export type Language = 'en' | 'pl';

const languageSerializer = {
	serialize: (val: Language) => val,
	deserialize: (raw: string): Language => {
		// Handle both plain strings ("pl") and JSON-encoded strings ('"pl"')
		try {
			const parsed = JSON.parse(raw);
			if (parsed === 'en' || parsed === 'pl') return parsed;
		} catch {
			// raw value is already a plain string
		}
		return raw === 'pl' ? 'pl' : 'en';
	}
};

function createLanguageStore() {
	const persisted = new PersistedState<Language>('language', 'en', {
		storage: 'local',
		syncTabs: true,
		serializer: languageSerializer
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
		}
	};
}

export const languageStore = createLanguageStore();
