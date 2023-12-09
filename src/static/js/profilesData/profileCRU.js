export function getProfileData(authorId) {
	const url = `/profiles/profile/?id=${authorId}`;
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

export function getProfileBySlug() {
	const currentUrl = window.location.href;
	const urlParts = currentUrl.split('/');
	const lastPart = urlParts[urlParts.length - 2];
	const url = `/profiles/profile/?slug=${lastPart}`;

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

export function updateProfile(userId, formData) {
	const url = `/profiles/profile/?id=${userId}`;
	const originUrl = window.location.origin;
	const updateProfileUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(updateProfileUrl, {
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
