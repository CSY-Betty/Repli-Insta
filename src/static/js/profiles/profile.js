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

document.addEventListener('DOMContentLoaded', function () {
	renderProfileInfo();
	renderProfilePost();
});
