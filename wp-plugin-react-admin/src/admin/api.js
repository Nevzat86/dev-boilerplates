import apiFetch from '@wordpress/api-fetch';

const BASE = '/my-plugin/v1';

export const api = {
	// Settings
	getSettings: () => apiFetch({ path: `${BASE}/settings` }),

	updateSettings: (data) =>
		apiFetch({
			path: `${BASE}/settings`,
			method: 'POST',
			data,
		}),

	// Items (CPT)
	getItems: (page = 1, perPage = 10) =>
		apiFetch({
			path: `${BASE}/items?page=${page}&per_page=${perPage}`,
			parse: false,
		}).then(async (response) => {
			const data = await response.json();
			return {
				items: data,
				total: parseInt(response.headers.get('X-WP-Total'), 10),
				totalPages: parseInt(response.headers.get('X-WP-TotalPages'), 10),
			};
		}),

	createItem: (data) =>
		apiFetch({
			path: `${BASE}/items`,
			method: 'POST',
			data,
		}),

	deleteItem: (id) =>
		apiFetch({
			path: `${BASE}/items/${id}`,
			method: 'DELETE',
		}),
};
