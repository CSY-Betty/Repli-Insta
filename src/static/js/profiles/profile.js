import { checkLogin } from '../auth/logStatus.js';
import { getRelationData } from './datafetch.js';
import { addFriend, accept, reject } from './addFriend.js';

function getProfile() {
	const currentUrl = window.location.href;
	const urlParts = currentUrl.split('/');
	const lastPart = urlParts[urlParts.length - 2];
	const profilesPart = urlParts
		.slice(0, urlParts.indexOf('profiles') + 1)
		.join('/');
	const url = profilesPart + `/profile/?slug=${lastPart}`;

	return fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	})
		.then((response) => response.json())
		.catch((error) => console.error('Error:', error));
}

async function renderProfileInfo() {
	const profileData = await getProfile();
	const user = await checkLogin();
	const profileInfo = document.getElementById('profileInfo');
	profileInfo.classList.add('flex', 'flex-col', 'items-center');

	const profileInfoContainer = document.createElement('div');
	profileInfoContainer.classList.add(
		'py-4',
		'flex',
		'flex-col',
		'items-center'
	);

	const profileAvatar = document.createElement('img');
	profileAvatar.classList.add(
		'h-40',
		'w-40',
		'rounded-full',
		'ring-2',
		'ring-white'
	);
	profileAvatar.src = profileData.avatar;

	const profileDetail = document.createElement('div');
	profileDetail.classList.add('grid', 'gap-y-4', 'py-6', 'px-12');

	const profileName = document.createElement('div');
	profileName.innerText =
		profileData.first_name + ' ' + profileData.last_name;

	const profileBio = document.createElement('div');
	profileBio.innerText = profileData.bio;

	const friendButton = document.createElement('div');
	friendButton.id = 'friendButton';
	friendButton.classList.add(
		'bg-white',
		'hover:bg-gray-100',
		'text-gray-800',
		'font-semibold',
		'py-2',
		'px-4',
		'border-b',
		'border-gray-400',
		'rounded',
		'shadow',
		'cursor-pointer',
		'my-4'
	);
	if (user.user_id === profileData.user) {
		friendButton.textContent = 'Friends';
	} else {
		const relationData = await getRelationData();
		const relation = await getFriendshipStatus(
			relationData,
			profileData.user
		);
		if (relation != 'check') {
			friendButton.textContent = relation;
		} else {
			friendButton.classList.value = '';
			const acceptButton = document.createElement('div');
			acceptButton.classList.add(
				'bg-green-500',
				'hover:bg-green-700',
				'text-white',
				'font-bold',
				'py-2',
				'px-4',
				'rounded',
				'cursor-pointer'
			);
			acceptButton.textContent = 'Accept';

			const rejectButton = document.createElement('div');
			rejectButton.classList.add(
				'bg-red-400',
				'hover:bg-red-700',
				'text-white',
				'font-bold',
				'py-2',
				'px-4',
				'rounded',
				'cursor-pointer',
				'my-4'
			);
			rejectButton.textContent = 'Reject';

			friendButton.appendChild(acceptButton);
			friendButton.appendChild(rejectButton);
		}
	}

	let likedPosts;
	if (user.user_id === profileData.user) {
		likedPosts = document.createElement('a');
		likedPosts.classList.add(
			'bg-white',
			'hover:bg-gray-100',
			'text-gray-800',
			'font-semibold',
			'py-2',
			'px-4',
			'border-b',
			'border-gray-400',
			'rounded',
			'shadow',
			'cursor-pointer'
		);
		likedPosts.textContent = 'Likes';

		const url = '/profiles/profile/likedposts/';
		const originUrl = window.location.origin;
		const likedPostsUrl = `${originUrl}${url}`;
		likedPosts.href = likedPostsUrl;
	}

	profileDetail.appendChild(profileName);
	profileDetail.appendChild(profileBio);

	profileInfoContainer.appendChild(profileAvatar);
	profileInfoContainer.appendChild(profileDetail);

	profileInfoContainer.appendChild(friendButton);

	if (likedPosts) {
		profileInfoContainer.appendChild(likedPosts);
	}

	profileInfo.appendChild(profileInfoContainer);
}

async function renderProfilePost() {
	const profileData = await getProfile();
	const posts = profileData.posts;
	const postsInfo = document.getElementById('postsInfo');
	postsInfo.classList.add('pt-4', 'flex', 'gap-4', 'w-full', 'flex-wrap');

	posts.forEach((post) => {
		const postContainer = document.createElement('div');
		postContainer.classList.add(
			'max-w-sm',
			'rounded',
			'overflow-hidden',
			'shadow-lg',
			'hover:scale-105',
			'transition-transform',
			'duration-300',
			'w-56'
		);

		const postImage = document.createElement('img');
		postImage.classList.add('w-full', 'h-64');
		postImage.src = post.image;
		postImage.alt = 'No Image';

		const postContent = document.createElement('div');
		postContent.classList.add('px-6', 'py-4', 'text-gray-700', 'text-base');
		postContent.innerText = post.content;

		postContainer.appendChild(postImage);
		postContainer.appendChild(postContent);
		postsInfo.appendChild(postContainer);
	});
}

async function friendButtonClick() {
	const friendButton = document.getElementById('friendButton');
	const profileData = await getProfile();
	const profileId = profileData.user;

	friendButton.addEventListener('click', function (event) {
		const buttonValue = event.target.textContent;
		if (buttonValue === 'Friends') {
			const url = '/profiles/profile/friends/';
			const originUrl = window.location.origin;
			const friendsUrl = `${originUrl}${url}`;
			window.location.href = friendsUrl;
		}

		if (buttonValue === 'Add friend') {
			addFriend(profileId).then(() => window.location.reload());
		}

		if (buttonValue === 'Accept') {
			accept(profileId).then(() => window.location.reload());
		}

		if (buttonValue === 'Reject') {
			reject(profileId).then(() => window.location.reload());
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	renderProfileInfo().then(friendButtonClick);
	renderProfilePost();
});

function getFriendshipStatus(relationData, someone_id) {
	const relation = relationData.find(
		(rel) => rel.sender === someone_id || rel.receiver === someone_id
	);

	if (!relation) {
		return 'Add friend';
	}

	if (relation.status === 'accepted') {
		return 'Hi! Friend';
	} else if (relation.status === 'send' && relation.receiver === someone_id) {
		return 'Waiting Approved';
	} else if (relation.status === 'send' && relation.sender === someone_id) {
		return 'check';
	}
}
