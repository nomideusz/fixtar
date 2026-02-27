import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function performSignOut(request: Request): Promise<Response> {
	return auth.api.signOut({ headers: request.headers, asResponse: true });
}

export const POST: RequestHandler = async ({ request }) => {
	const response = await performSignOut(request);
	return new Response(JSON.stringify({ success: true }), {
		headers: {
			'Content-Type': 'application/json',
			'Set-Cookie': response.headers.get('set-cookie') || ''
		}
	});
};

export const GET: RequestHandler = async ({ request }) => {
	const response = await performSignOut(request);
	const setCookie = response.headers.get('set-cookie');
	const headers: Record<string, string> = { Location: '/' };
	if (setCookie) headers['Set-Cookie'] = setCookie;
	return new Response(null, { status: 303, headers });
};
