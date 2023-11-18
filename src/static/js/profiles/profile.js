import { checkLogin } from '../auth/logStatus.js';
import { getRelationData } from './datafetch.js';

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

	profileDetail.appendChild(profileName);
	profileDetail.appendChild(profileBio);

	profileInfoContainer.appendChild(profileAvatar);
	profileInfoContainer.appendChild(profileDetail);

	profileInfo.appendChild(profileInfoContainer);
}

async function renderProfilePost() {
	const profileData = await getProfile();
	const posts = profileData.posts;
	const postsInfo = document.getElementById('postsInfo');
	postsInfo.classList.add('grid', 'grid-cols-3', 'gap-4', 'py-4');

	posts.forEach((post) => {
		const postContainer = document.createElement('div');
		postContainer.classList.add(
			'max-w-sm',
			'rounded',
			'overflow-hidden',
			'shadow-lg',
			'hover:scale-105',
			'transition-transform',
			'duration-300'
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

async function renderFriendButton() {
	const profileInfo = document.getElementById('profileInfo');
	const friendButton = document.createElement('button');
	friendButton.id = 'friendButton';

	const loginStatus = await checkLogin();
	console.log(loginStatus.user_id);
	const profileData = await getProfile();
	console.log(profileData);
	if (loginStatus.user_id === profileData.user) {
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
			'shadow'
		);
		friendButton.textContent = 'Friends';

		profileInfo.appendChild(friendButton);
	} else {
		const relationData = await getRelationData();
		const relation = await getFriendshipStatus(
			relationData,
			profileData.user
		);

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
			'shadow'
		);
		friendButton.textContent = relation;

		profileInfo.appendChild(friendButton);
	}
}

function friendButtonClick() {
	const friendButton = document.getElementById('friendButton');
	friendButton.addEventListener('click', function () {
		const buttonValue = friendButton.textContent;

		if (buttonValue === 'Friends') {
			const originUrl = window.location.origin;
			const url = 'profile/friends/';
			const absoluteUrl = `${originUrl}/profiles/${url}`;

			window.location.href = absoluteUrl;
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	renderProfileInfo().then(renderFriendButton).then(friendButtonClick);
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
		return 'Accept';
	} else if (relation.status === 'send' && relation.sender === someone_id) {
		return 'Wait';
	}

	return 'Add Friend';
}
