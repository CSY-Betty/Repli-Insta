export function getPosts() {
	const url = `/posts/posts-list/`;
	const originUrl = window.location.origin;
	const postsDataUrl = `${originUrl}${url}`;

	return fetch(postsDataUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}

export function getPostData(post_id) {
	const url = `/posts/post?post_id=${post_id}`;
	const originUrl = window.location.origin;
	const postDataUrl = `${originUrl}${url}`;

	return fetch(postDataUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}

export function getCommentsData(post_id) {
	const url = `/posts/comments?post_id=${post_id}`;
	const originUrl = window.location.origin;
	const commentDataUrl = `${originUrl}${url}`;

	return fetch(commentDataUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}
