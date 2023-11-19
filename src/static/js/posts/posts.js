import { postComment } from './comment.js';
import { getPosts, getPostData, getCommentsData } from './datafetch.js';
import { checkLogin } from '../auth/logStatus.js';

async function renderCenterPosts() {
	const postsData = await getPosts();
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
		if (post.image) {
			postImage.src = post.image;
		} else {
			postImage.src = '/static/img/no-photo.png';
		}

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

		const user = await checkLogin();
		let postLikeButton;
		if (user.user_id != 999) {
			const postLikeStatus = await checkPostLikeStatus(post.post_id);

			postLikeButton = document.createElement('img');

			postLikeButton.classList.add('postLikeButton', 'w-6', 'h-6');
			if (postLikeStatus.length != 0) {
				postLikeButton.src = '/static/img/like.png';
			} else {
				postLikeButton.src = '/static/img/unlike.png';
			}

			postLikeButton.dataset.postId = post.post_id;
		}

		const postContent = document.createElement('div');
		postContent.classList.add('px-6', 'py-4', 'text-gray-700', 'text-base');
		postContent.innerText = post.content;

		postLike.appendChild(postLikeNumber);
		if (postLikeButton) {
			postLike.appendChild(postLikeButton);
		}

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

function createRightPost(postData) {
	const rightPostContainer = document.getElementById('rightPostContainer');
	rightPostContainer.innerHTML = '';
	rightPostContainer.classList.add(
		'z-20',
		'ml-10',
		'fixed',
		'w-80',
		'rounded',
		'overflow-hidden',
		'shadow-lg',
		'flex',
		'flex-col',
		'transform',
		'transition-transform',
		'ease-in-out',
		'duration-300'
	);

	const postImage = document.createElement('img');
	postImage.src = postData.image;
	postImage.classList.add('h-48', 'object-cover');

	const authorInfo = document.createElement('div');
	authorInfo.classList.add(
		'flex',
		'flex-row',
		'px-6',
		'py-2',
		'items-center'
	);

	const authorAvatar = document.createElement('img');
	authorAvatar.classList.add(
		'authorAvatar',
		'h-8',
		'w-8',
		'rounded-full',
		'ring-2',
		'ring-white'
	);
	authorAvatar.src = postData.author_profile.avatar;

	const authorData = document.createElement('div');
	authorData.classList.add('px-2');

	const authorName = document.createElement('div');
	authorName.innerText = postData.author_profile.first_name;

	const postTime = document.createElement('div');
	postTime.classList.add('text-xs');
	let time = timeCalculate(postData.created);
	postTime.innerText = time;

	const postContent = document.createElement('div');
	postContent.classList.add('px-6', 'py-4', 'text-gray-700', 'text-base');
	postContent.innerText = postData.content;

	authorData.appendChild(authorName);
	authorData.appendChild(postTime);

	authorInfo.appendChild(authorAvatar);
	authorInfo.appendChild(authorData);

	rightPostContainer.appendChild(postImage);
	rightPostContainer.appendChild(authorInfo);
	rightPostContainer.appendChild(postContent);
}

function createRightComment(commmentsData) {
	const rightPostContainer = document.getElementById('rightPostContainer');

	commmentsData.forEach((comment) => {
		const commentContainer = document.createElement('div');
		commentContainer.classList.add('flex', 'flex-row', 'px-6', 'py-2');

		const commentAvatar = document.createElement('img');
		commentAvatar.src = comment.commenter_profile.avatar;
		commentAvatar.classList.add(
			'h-8',
			'w-8',
			'rounded-full',
			'ring-2',
			'ring-white'
		);

		const commentContent = document.createElement('div');
		commentContent.innerText = comment.body;
		commentContent.classList.add('px-2');

		commentContainer.appendChild(commentAvatar);
		commentContainer.appendChild(commentContent);

		rightPostContainer.appendChild(commentContainer);
	});
}

function createRightCommentForm(post_id) {
	const rightPostContainer = document.getElementById('rightPostContainer');

	const commentForm = document.createElement('form');
	commentForm.classList.add(
		'commentForm',
		'flex',
		'w-full',
		'max-w-xl',
		'bg-white',
		'rounded-lg',
		'px-4',
		'pt-2',
		'items-center',
		'justify-center',
		'mb-2'
	);

	const commentText = document.createElement('textarea');
	commentText.classList.add(
		'commentText',
		'base-3/4',
		'border-b',
		'border-gray-400',
		'leading-normal',
		'resize-none',
		'h-10',
		'py-2',
		'px-3',
		'font-medium'
	);
	commentText.setAttribute('required', true);

	const commentButton = document.createElement('img');
	commentButton.classList.add(
		'commentButton',
		'base-1/4',
		'w-8',
		'h-8',
		'mx-2',
		'cursor-pointer'
	);
	commentButton.src = '/static/img/comment.png';

	const commentSubmit = document.createElement('input');
	commentSubmit.classList.add('hidden');
	commentSubmit.type = 'submit';
	commentSubmit.value = post_id;

	commentForm.appendChild(commentText);
	commentForm.appendChild(commentButton);
	commentForm.appendChild(commentSubmit);

	rightPostContainer.appendChild(commentForm);
}

async function renderRightPost() {
	const postsContainer = document.getElementById('postsContainer');

	postsContainer.addEventListener('click', async (event) => {
		const clickImage = event.target.closest('.post_image');
		const post_id = clickImage?.getAttribute('data-post-id');
		if (post_id) {
			const postData = await getPostData(post_id);
			createRightPost(postData[0]);
			const commentsData = await getCommentsData(post_id);
			createRightCommentForm(post_id);
			createRightComment(commentsData);
			postComment(post_id);
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	renderCenterPosts();
	renderRightPost();
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
