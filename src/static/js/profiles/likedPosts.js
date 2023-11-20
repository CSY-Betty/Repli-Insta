function getLikedPosts() {
	const url = '/posts/post/userliked/';
	const originUrl = window.location.origin;
	const likedPostsUrl = `${originUrl}${url}`;

	return fetch(likedPostsUrl, {
		method: 'GET',
	})
		.then((response) => response.json())
		.then((data) => data)
		.catch((error) => console.error('Error:', error));
}

async function renderCenterPosts() {
	const postsData = await getLikedPosts();
	const postsContainer = document.getElementById('postsContainer');
	postsContainer.classList.add(
		'pt-4',
		'flex',
		'gap-4',
		'w-full',
		'flex-wrap'
	);

	for (const post of postsData) {
		const postContainer = document.createElement('div');
		postContainer.classList.add(
			'rounded',
			'overflow-hidden',
			'shadow-lg',
			'hover:scale-105',
			'transition-transform',
			'duration-300',
			'w-56'
		);

		const postImage = document.createElement('img');
		postImage.classList.add('post_image', 'w-full', 'h-64');
		postImage.src = post.image;
		postImage.alt = 'No Image';
		postImage.dataset.postId = post.post_id;
		const authorInfo = document.createElement('div');
		authorInfo.classList.add(
			'flex',
			'flex-row',
			'px-6',
			'py-2',
			'items-center',
			'justify-between'
		);

		const authorAvatar = document.createElement('img');
		authorAvatar.classList.add(
			'authorAvatar',
			'h-8',
			'w-8',
			'rounded-full',
			'ring-2',
			'ring-white',
			'cursor-pointer'
		);
		authorAvatar.src = post.author_profile.avatar;
		authorAvatar.dataset.authorSlug = post.author_profile.slug;

		const authorData = document.createElement('div');
		authorData.classList.add('px-2', 'overflow-hidden');

		const authorName = document.createElement('div');
		authorName.classList.add('overflow-ellipsis', 'no-wrap');
		authorName.innerText = post.author_profile.first_name;

		const postTime = document.createElement('div');
		postTime.classList.add('text-xs');
		let time = timeCalculate(post.created);
		postTime.innerText = time;

		const postLike = document.createElement('div');
		postLike.classList.add('postLike', 'flex', 'flex-col', 'items-end');

		const postLikeNumber = document.createElement('div');
		postLikeNumber.classList.add('postLikeNumber');
		postLikeNumber.innerText = post.liked.length;

		const postLikeStatus = await checkPostLikeStatus(post.post_id);

		const postLikeButton = document.createElement('img');
		postLikeButton.classList.add(
			'postLikeButton',
			'w-6',
			'h-6',
			'cursor-pointer'
		);
		if (postLikeStatus.length != 0) {
			postLikeButton.src = '/static/img/like.png';
		} else {
			postLikeButton.src = '/static/img/unlike.png';
		}

		postLikeButton.dataset.postId = post.post_id;

		const postContent = document.createElement('div');
		postContent.classList.add('px-6', 'py-4', 'text-gray-700', 'text-base');
		postContent.innerText = post.content;

		postLike.appendChild(postLikeNumber);
		postLike.appendChild(postLikeButton);

		authorInfo.appendChild(authorAvatar);

		authorData.appendChild(authorName);
		authorData.appendChild(postTime);
		authorInfo.appendChild(authorData);

		authorInfo.appendChild(postLike);

		postContainer.appendChild(postImage);
		postContainer.appendChild(authorInfo);
		postContainer.appendChild(postContent);

		postsContainer.appendChild(postContainer);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	renderCenterPosts();
	const renderComplete = new Event('renderComplete');
	document.dispatchEvent(renderComplete);
});

function timeCalculate(time) {
	const postDate = new Date(time);
	const now = new Date();

	const timeDiff = now - postDate;

	const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hoursDiff = Math.floor(
		(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);

	if (daysDiff > 0) {
		return `${daysDiff} days ${hoursDiff} hours ago`;
	} else {
		return `${hoursDiff} hours ago`;
	}
}

function checkPostLikeStatus(post_id) {
	const url = `/posts/post/like/${post_id}/`;
	const originUrl = window.location.origin;
	const checkUrl = `${originUrl}${url}`;

	return fetch(checkUrl, {
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
