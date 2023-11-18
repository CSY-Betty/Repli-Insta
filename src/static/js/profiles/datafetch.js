export function getRelationData() {
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
