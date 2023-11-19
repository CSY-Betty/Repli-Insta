import { checkLogin } from '../auth/logStatus.js';

export async function addFriend(profileId) {
	const user = await checkLogin();

	const originUrl = window.location.origin;
	const url = '/profiles/profile/friends/add/';

	const addFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		sender: user.user_id,
		receiver: profileId,
		status: 'send',
	};

	fetch(addFriendUrl, {
		method: 'POST',
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

export async function accept(profileId) {
	const userId = await checkLogin();

	const originUrl = window.location.origin;
	const url = '/profiles/profile/friends/accept/';

	const acceptFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		sender: profileId,
		receiver: userId.user_id,
		status: 'send',
	};

	fetch(acceptFriendUrl, {
		method: 'PUT',
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

export async function reject(profileId) {
	const userId = await checkLogin();

	const originUrl = window.location.origin;
	const url = `/profiles/profile/friends/reject/${profileId}`;

	const rejectFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		sender: profileId,
		receiver: userId.user_id,
		status: 'send',
	};

	fetch(rejectFriendUrl, {
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
