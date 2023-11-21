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

function createPostContainer(postData) {
	console.log(postData);
	postModal.classList.add(
		'hidden',
		'flex',
		'flex-row',
		'justify-center',
		'fade',
		'bg-slate-300/50',
		'h-full',
		'w-full',
		'z-50',
		'fixed',
		'items-center'
	);

	const postContainer = document.createElement('div');
	postContainer.classList.add(
		'w-3/5',
		'h-3/5',
		'bg-white',
		'rounded',
		'overflow-hidden',
		'flex',
		'flex-row'
	);

	const postImage = document.createElement('img');
	postImage.src = postData.image;
	postImage.classList.add('h-full', 'w-3/5', 'object-cover', 'self-center');

	const postInfo = document.createElement('div');
	postInfo.id = 'postInfo';

	postInfo.classList.add('h-full', 'flex', 'flex-col', 'w-2/5');

	const authorInfo = document.createElement('div');
	authorInfo.classList.add(
		'flex',
		'flex-row',
		'px-6',
		'py-2',
		'items-center',
		'h-1/6'
	);

	const authorAvatar = document.createElement('img');
	authorAvatar.classList.add(
		'authorAvatar',
		'h-8',
		'w-8',
		'rounded-full',
		'ring-2',
		'ring-white',
		'mx-2'
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
	postContent.classList.add(
		'px-6',
		'py-4',
		'text-gray-700',
		'text-base',
		'h-2/6'
	);
	postContent.innerText = postData.content;

	authorInfo.appendChild(authorAvatar);
	authorInfo.appendChild(authorName);
	authorInfo.appendChild(postTime);

	postInfo.appendChild(authorInfo);
	postInfo.appendChild(postContent);

	postContainer.appendChild(postImage);
	postContainer.appendChild(postInfo);

	postModal.appendChild(postContainer);
}

function createCommentContainer(commmentsData) {
	const postInfo = document.getElementById('postInfo');

	const commentContainer = document.createElement('div');
	commentContainer.classList.add(
		'flex',
		'flex-col',
		'px-6',
		'py-2',
		'overflow-y-scroll',
		'h-2/6',
		'mt-3/5'
	);

	commmentsData.forEach((comment) => {
		const commenterInfo = document.createElement('div');
		commenterInfo.classList.add('flex', 'flex-row');
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

		commenterInfo.appendChild(commentAvatar);
		commenterInfo.appendChild(commentContent);

		commentContainer.appendChild(commenterInfo);
	});
	postInfo.appendChild(commentContainer);
}

function createCommentForm(post_id) {
	const postInfo = document.getElementById('postInfo');

	const commentForm = document.createElement('form');
	commentForm.classList.add(
		'commentForm',
		'flex',
		'w-full',
		'rounded-lg',
		'mt-auto',
		'mb-2',
		'justify-end',
		'mr-2'
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

	postInfo.appendChild(commentForm);
}

async function showPost() {
	const postsContainer = document.getElementById('postsContainer');
	const postModal = document.getElementById('postModal');

	postsContainer.addEventListener('click', async (event) => {
		const clickImage = event.target.closest('.post_image');
		const post_id = clickImage?.getAttribute('data-post-id');
		if (post_id) {
			const postData = await getPostData(post_id);
			postModal.innerHTML = ''; // 清空内容

			createPostContainer(postData[0]);
			postModal.classList.remove('hidden');
			// postModal.showModal();

			const commentsData = await getCommentsData(post_id);
			createCommentContainer(commentsData);

			createCommentForm(post_id);
			postComment(post_id);

			postModal.addEventListener('click', (event) => {
				console.log(event.target);
				if (event.target === postModal) {
					postModal.classList.add('hidden');
				}
			});
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	renderCenterPosts();
	showPost();
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
