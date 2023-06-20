import { customAlphabet } from 'nanoid';
import { v4 } from 'uuid';
import { redirect } from '@sveltejs/kit';
import { createClient } from '@vercel/kv';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

export const actions = {
	createPoll: async ({ request }) => {
		const data = await request.formData();

		// Create a new UUID
		const nanoid = customAlphabet('1234567890abcdefghijklmnpqrstvxyz', 10);
		const id = nanoid(8);

		// Map options from data to PollOption[]
		const formDataOptions = data.getAll('option');

		/** @type {PollOption[]} */
		const options = formDataOptions.map((option) => ({
			id: v4(),
			name: option.toString()
		}));

		// Create a new poll
		/** @type {Poll} */
		const newPoll = {
			id,
			title: data.get('title')?.toString() || 'Untitled Poll',
			options,
			participants: []
		};

		// Write to store
		const client = createClient({
			url: KV_REST_API_URL,
			token: KV_REST_API_TOKEN
		});

		// Wait for the write to succeed
		await client.set(id, newPoll);

		// Redirect to new event
		throw redirect(303, `/p/${id}`);
	}
};
