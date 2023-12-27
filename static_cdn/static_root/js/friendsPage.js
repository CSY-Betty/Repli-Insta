import { user } from './navbar.js';
import { createFriendsContainer } from './profiles/friendsContainer.js';

import { getProfileData } from './profilesData/profileCRU.js';

import {
	getFriendsData,
	acceptRejectFriend,
	removeFriend,
} from './profilesData/friendsCRUD.js';

async function renderFriendList(userData) {
	const friendsData = await getFriendsData();

	await createFriendsContainer(userData.user, friendsData);
	await addFriendEventListeners();
}

function addFriendEventListeners() {
	const friendRelate = document.getElementById('friendRelate');

	friendRelate.addEventListener('click', (event) => {
		const friendContainer = event.target.closest('.friendContainer');
		const friendId = friendContainer.dataset.friendId;
		const friendSlug = friendContainer.dataset.slug;

		const friendAvatarImage = event.target.closest('.friendAvatar');

		const acceptFriendButton = event.target.closest('.acceptFriend');
		const rejectFriendButton = event.target.closest('.rejectFriend');
		const removeFriendButton = event.target.closest('.removeFriend');
		if (acceptFriendButton) {
			acceptRejectFriend(friendId, 'accept');
			location.reload();
		} else if (rejectFriendButton) {
			acceptRejectFriend(friendId, 'reject');
			location.reload();
		} else if (removeFriendButton) {
			removeFriend(friendId);
			location.reload();
		} else if (friendAvatarImage) {
			window.location.href = '/profiles/' + friendSlug;
		}
	});
}

async function getUserProfile(user) {
	if (user.user_id != 999) {
		return await getProfileData(user.user_id);
	}
	return null;
}

document.addEventListener('loginStatusChecked', async function () {
	const userData = await getUserProfile(user);
	renderFriendList(userData);
});
