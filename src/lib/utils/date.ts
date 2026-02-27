/**
 * Date utility functions
 */

/**
 * Format ISO date string to localized string
 * Handles empty strings and invalid dates properly
 */
export function formatDate(isoString: string | null | undefined): string {
	// Handle falsy values and empty strings
	if (!isoString || isoString === '' || isoString.trim() === '') {
		return 'N/A';
	}

	try {
		const date = new Date(isoString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			return 'N/A';
		}

		return date.toLocaleString();
	} catch (error) {
		console.warn('Error formatting date:', error);
		return 'N/A';
	}
}

/**
 * Format ISO date string to short date format (YYYY-MM-DD)
 */
export function formatDateShort(isoString: string | null | undefined): string {
	if (!isoString || isoString === '' || isoString.trim() === '') {
		return 'N/A';
	}

	try {
		const date = new Date(isoString);

		if (isNaN(date.getTime())) {
			return 'N/A';
		}

		return date.toLocaleDateString();
	} catch (error) {
		console.warn('Error formatting date:', error);
		return 'N/A';
	}
}

/**
 * Format ISO date string to relative time (e.g., "2 hours ago")
 */
export function formatDateRelative(isoString: string | null | undefined): string {
	if (!isoString || isoString === '' || isoString.trim() === '') {
		return 'N/A';
	}

	try {
		const date = new Date(isoString);

		if (isNaN(date.getTime())) {
			return 'N/A';
		}

		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSeconds = Math.floor(diffMs / 1000);
		const diffMinutes = Math.floor(diffSeconds / 60);
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffSeconds < 60) {
			return 'just now';
		} else if (diffMinutes < 60) {
			return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
		} else if (diffHours < 24) {
			return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
		} else if (diffDays < 30) {
			return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
		} else {
			return date.toLocaleDateString();
		}
	} catch (error) {
		console.warn('Error formatting relative date:', error);
		return 'N/A';
	}
}
