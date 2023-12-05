export function updateLike(postId) {
	const url = `/posts/testlike/?id=${postId}`;
	const originUrl = window.location.origin;
	const updateLike = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(updateLike, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
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
