export function getPostsData(author = null) {
	const url = '/posts/post/';
	const queryParams = author ? `?author=${author}` : '';
	const originUrl = window.location.origin;
	const postsDataUrl = `${originUrl}${url}${queryParams}`;

	return fetch(postsDataUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}

export function getPostData(postId) {
	const url = `/posts/post/?id=${postId}`;
	const originUrl = window.location.origin;
	const postsDataUrl = `${originUrl}${url}`;

	return fetch(postsDataUrl, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}

export function updatePost(postId, formData) {
	const url = `/posts/post/?id=${postId}`;
	const originUrl = window.location.origin;
	const updatePostUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(updatePostUrl, {
		method: 'PATCH',
		headers: {
			'X-CSRFToken': csrfToken,
		},
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}

export function deletePost(postId) {
	const url = `/posts/post/?id=${postId}`;
	const originUrl = window.location.origin;
	const updatePostUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(updatePostUrl, {
		method: 'DELETE',
		headers: {
			'X-CSRFToken': csrfToken,
		},
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}
