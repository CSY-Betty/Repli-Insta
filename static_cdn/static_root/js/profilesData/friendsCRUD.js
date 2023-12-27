export function getFriendsData() {
	const url = `/profiles/friends/`;
	const originUrl = window.location.origin;
	const friendsDataUrl = `${originUrl}${url}`;

	return fetch(friendsDataUrl, {
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

export function addFriend(receiver) {
	const url = `/profiles/friends/`;
	const originUrl = window.location.origin;
	const addFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const friendData = {
		receiver: receiver,
	};

	return fetch(addFriendUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(friendData),
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}

export function acceptRejectFriend(sender, action) {
	const url = `/profiles/friends/`;
	const originUrl = window.location.origin;
	const acceptRejectFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const friendData = {
		sender: sender,
		action: action,
	};

	return fetch(acceptRejectFriendUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(friendData),
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}

export function removeFriend(friend_id) {
	console.log(friend_id);
	const url = `/profiles/friends/?friendId=${friend_id}`;
	const originUrl = window.location.origin;
	const removeFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(removeFriendUrl, {
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
