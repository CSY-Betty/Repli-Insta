import { checkLogin } from '../auth/logStatus.js';

export async function getRelationData() {
	const logStatus = await checkLogin();
	if (logStatus.user_id != 999) {
		const originUrl = window.location.origin;
		const url = 'profile/friends/list';
		const absoluteUrl = `${originUrl}/profiles/${url}`;

		return fetch(absoluteUrl, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then((data) => data)
			.catch((error) => console.error('Error:', error));
	}
}
