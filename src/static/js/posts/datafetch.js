export function getPosts() {
	const url = 'posts-list/';

	return fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}

export function getPostData(post_id) {
	const url = `post?post_id=${post_id}`;

	return fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}

export function getCommentsData(post_id) {
	const url = `comments?post_id=${post_id}`;

	return fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}
