import { createClient } from '@vercel/kv';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	// Write to store
	const events = createClient({
		url: KV_REST_API_URL,
		token: KV_REST_API_TOKEN
	});

	// Cast event to Poll
	const event = /** @type {Poll} */ (await events.get(params.slug));

	return {
		event
	};
}
