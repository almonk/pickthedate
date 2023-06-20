import { createClient } from '@vercel/kv';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	// Prep store
	const client = createClient({
		url: KV_REST_API_URL,
		token: KV_REST_API_TOKEN
	});

	// Wait for the write to succeed
	const data = await request.json();

	// Remove options with no name
	data.options = data.options.filter((/** @type {{ name: any; }} */ option) => option.name);

	// Remove participants with no name
	data.participants = data.participants.filter((/** @type {Participant} */ participant) => participant.name);


	await client.set(data.id, data);

	return new Response('Success!', {
		status: 200
	});
}
