import { deleteSessionCookie, logoutUser, SESSION_COOKIE_NAME } from '$lib/server/auth';
import { redirect, json } from '@sveltejs/kit';
import type { RequestHandler, RequestEvent } from './$types';

/**
 * Bardzo agresywna funkcja usuwania ciasteczek stosująca różne metody
 */
function nukeAllCookies(event: RequestEvent) {
	console.log('Aggressive cookie deletion starting...');

	// Lista ścieżek na których mogą być ciasteczka
	const paths = ['/', '/auth', '/api', '/account', '/auth/logout', ''];

	// Lista nazw ciasteczek do usunięcia
	const cookieNames = [
		'pb-auth',
		'pb-auth_exists',
		'pb_auth',
		'pocketbase_auth',
		'auth',
		'session'
	];

	// Lista wszystkich możliwych domen
	const domains = [
		undefined, // Bez specyfikacji domeny
		'', // Pusta domena
		event.url.hostname, // Dokładna domena
		`.${event.url.hostname}`, // Domena z kropką (aby objąć wszystkie subdomeny)
		'localhost' // Dla środowiska deweloperskiego
	];

	// Dla każdej kombinacji nazwy, ścieżki i domeny - usuń ciasteczko
	for (const name of cookieNames) {
		for (const path of paths) {
			for (const domain of domains) {
				try {
					// Ustaw wygasłe ciasteczko
					event.cookies.set(name, '', {
						path,
						domain,
						expires: new Date(0),
						maxAge: 0,
						sameSite: 'lax',
						httpOnly: true,
						secure: false
					});

					// Spróbuj również z różnymi opcjami secure i sameSite
					event.cookies.set(name, '', {
						path,
						domain,
						expires: new Date(0),
						maxAge: 0,
						sameSite: 'strict',
						httpOnly: true,
						secure: true
					});

					// Spróbuj również z opcją httpOnly: false
					event.cookies.set(name, '', {
						path,
						domain,
						expires: new Date(0),
						maxAge: 0,
						sameSite: 'lax',
						httpOnly: false,
						secure: false
					});
				} catch (e) {
					// Ignoruj błędy i kontynuuj
				}
			}
		}
	}

	// Dodaj standardową funkcję usuwania
	deleteSessionCookie(event);

	console.log('Aggressive cookie deletion completed');
}

// Server-side logout endpoint
// This handles the server-side aspects of logout like clearing cookies
// The client-side state is managed by the userContext in the +page.svelte component
export const POST: RequestHandler = async (event) => {
	try {
		console.log('POST logout handler: Starting server logout process');

		// Clear PocketBase auth store
		await logoutUser(event.locals.pb);
		console.log('POST logout handler: PocketBase auth store cleared');

		// Nuke all cookies with our aggressive function
		nukeAllCookies(event);

		// Log all current cookies for debugging
		const allCookies = event.request.headers.get('cookie') || '';
		console.log('POST logout handler: Remaining cookies after deletion:', allCookies);

		// Tworzenie odpowiedzi z dodatkowymi nagłówkami
		const headers = new Headers();
		headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
		headers.append('Pragma', 'no-cache');
		headers.append('Expires', '0');
		headers.append('Clear-Site-Data', '"cache", "cookies", "storage"');

		// Return success response with custom headers
		return json(
			{ success: true, message: 'Logout completed successfully' },
			{
				headers,
				status: 200
			}
		);
	} catch (error) {
		console.error('POST logout handler error:', error);
		return json({ success: false, error: 'Logout failed' }, { status: 500 });
	}
};

// Allow GET requests for convenience (e.g., direct browser navigation to /auth/logout)
export const GET: RequestHandler = async (event) => {
	try {
		console.log('GET logout handler: Starting server logout process');

		// Sprawdź, czy jest to wymuszony logout
		const forceLogout = event.url.searchParams.get('force') === 'true';

		// Clear PocketBase auth store
		await logoutUser(event.locals.pb);
		console.log('GET logout handler: PocketBase auth store cleared');

		// Nuke all cookies with our aggressive function
		nukeAllCookies(event);

		// Przygotuj nagłówki dla odpowiedzi
		const headers = new Headers();
		headers.append('Location', forceLogout ? '/?forced_logout=true' : '/?logged_out=true');
		headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
		headers.append('Pragma', 'no-cache');
		headers.append('Expires', '0');
		headers.append('Clear-Site-Data', '"cache", "cookies", "storage"');

		// Log all current cookies for debugging
		const allCookies = event.request.headers.get('cookie') || '';
		console.log('GET logout handler: Remaining cookies after deletion:', allCookies);

		// Zwróć odpowiedź z niestandardowymi nagłówkami
		return new Response(null, {
			status: 302,
			headers
		});
	} catch (error) {
		console.error('GET logout handler error:', error);

		// W przypadku błędu, przekieruj do strony głównej
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/?error=logout_failed',
				'Clear-Site-Data': '"cookies", "storage"'
			}
		});
	}
};
