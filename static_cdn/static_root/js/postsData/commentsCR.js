export function getCommentsData(postId) {
	const url = `/posts/comment/?id=${postId}`;
	const originUrl = window.location.origin;
	const commentsDataUrl = `${originUrl}${url}`;

	return fetch(commentsDataUrl, {
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

export function createComment(postId, commentBody) {
	const url = `/posts/comment/?id=${postId}`;
	const originUrl = window.location.origin;
	const createCommentUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const commentData = {
		body: commentBody,
	};
	return fetch(createCommentUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(commentData),
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}
