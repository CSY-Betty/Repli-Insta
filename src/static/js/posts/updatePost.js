import { checkLogin } from '../auth/logStatus.js';

export async function updateThePost(post_id, formData) {
	const userId = await checkLogin();

	const originUrl = window.location.origin;
	const url = '/posts/post/update/';

	const acceptFriendUrl = `${originUrl}${url}${post_id}/`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(acceptFriendUrl, {
		method: 'PUT',
		headers: {
			'X-CSRFToken': csrfToken,
		},
		body: formData,
	})
		.then((response) => response.json())
		.then((data) => console.log('sucess: ', data))
		.catch(console.error());
}

export async function deleteThePost(post_id) {
	const userId = await checkLogin();

	const originUrl = window.location.origin;
	const url = '/posts/post/delete/';

	const deletePostUrl = `${originUrl}${url}${post_id}/`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		post_id: post_id,
	};

	return fetch(deletePostUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => console.log('sucess: ', data))
		.catch(console.error());
}
