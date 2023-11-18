import { checkLogin } from '../auth/logStatus.js';

export async function addFriend() {
	const friendButton = document.getElementById('friendButton');
	const receiverId = friendButton.dataset.profileAuthor;

	const user = await checkLogin();

	friendButton.addEventListener('click', function () {
		if ((friendButton.innerText = 'Add Friend')) {
			const originUrl = window.location.origin;
			const url = '/profiles/profile/friends/add/';

			const addFriendUrl = `${originUrl}${url}`;

			const csrfToken = document.getElementsByName(
				'csrfmiddlewaretoken'
			)[0].value;

			const data = {
				sender: user.user_id,
				receiver: receiverId,
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
	});
}
