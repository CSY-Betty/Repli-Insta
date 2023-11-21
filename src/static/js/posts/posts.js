// import { postComment } from './comment.js';
import { getPosts, getPostData, getCommentsData } from './datafetch.js';
import { checkLogin } from '../auth/logStatus.js';

async function renderCenterPosts() {
	const postsData = await getPosts();
	const postsContainer = document.getElementById('postsContainer');
	postsContainer.classList.add(
		'ml-96',
		'mr-48',
		'pt-8',
		'grid',
		'gap-4',
		'grid-cols-3'
	);

	for (const post of postsData) {
		const postContainer = document.createElement('div');
		postContainer.classList.add(
			'rounded',
			'overflow-hidden',
			'shadow-lg',
			'hover:scale-105',
			'transition-transform',
			'duration-300'
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

		postContainer.appendChild(postImage);

		postsContainer.appendChild(postContainer);
	}
}

function createPostContainer(postData) {
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
		'w-4/5',
		'h-4/5',
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

	postInfo.classList.add(
		'h-full',
		'flex',
		'flex-col',
		'w-2/5',
		'px-2',
		'items-start'
	);

	const authorInfo = document.createElement('div');
	authorInfo.classList.add(
		'flex',
		'flex-row',
		'items-center',
		'h-20',
		'w-full',
		'border-b'
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
	authorData.classList.add('flex', 'flex-col');

	const authorName = document.createElement('div');
	authorName.innerText = postData.author_profile.first_name;

	const addAuthor = document.createElement('div');
	addAuthor.classList.add('text-rose-400', 'cursor-pointer', 'ml-auto');
	addAuthor.innerText = 'Add Friend';

	const postContent = document.createElement('div');
	postContent.classList.add(
		'px-6',
		'py-4',
		'text-gray-700',
		'text-base',
		'h-2/6',
		'border-b',
		'w-full'
	);
	postContent.innerText = postData.content;

	authorInfo.appendChild(authorAvatar);
	authorInfo.appendChild(authorName);
	authorInfo.appendChild(addAuthor);

	postInfo.appendChild(authorInfo);
	postInfo.appendChild(postContent);

	postContainer.appendChild(postImage);
	postContainer.appendChild(postInfo);

	postModal.appendChild(postContainer);
}

function createCommentContainer(commmentsData) {
	const postInfo = document.getElementById('postInfo');

	const commentContainer = document.createElement('div');
	commentContainer.id = 'commentContainer';
	commentContainer.classList.add(
		'flex',
		'flex-col',
		'px-6',
		'py-2',
		'overflow-y-scroll',
		'h-2/6',
		'mt-3/5',
		'border-b',
		'w-full'
	);

	commmentsData.reverse().forEach((comment) => {
		const commenterInfo = document.createElement('div');
		commenterInfo.classList.add('flex', 'flex-row', 'py-2');
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

async function createPostLikeContainer(postData) {
	const postInfo = document.getElementById('postInfo');
	const postLikeContainer = document.createElement('div');
	postLikeContainer.classList.add(
		'w-full',
		'border-b',
		'h-16',
		'flex',
		'flex-row',
		'items-center'
	);

	const postTime = document.createElement('div');
	postTime.classList.add('text-xs', 'px-2');
	let time = timeCalculate(postData.created);
	postTime.innerText = time;

	const postLike = document.createElement('div');
	postLike.classList.add('postLike', 'flex', 'flex-col', 'items-end');

	const postLikeNumber = document.createElement('div');
	postLikeNumber.classList.add('postLikeNumber', 'ml-auto', 'px-2');
	postLikeNumber.innerText = postData.liked.length + ' ' + 'Likes';

	const user = await checkLogin();
	let postLikeButton;
	if (user.user_id != 999) {
		const postLikeStatus = await checkPostLikeStatus(postData.post_id);

		postLikeButton = document.createElement('img');

		postLikeButton.classList.add('postLikeButton', 'w-6', 'h-6', 'mx-2');
		if (postLikeStatus.length != 0) {
			postLikeButton.src = '/static/img/like.png';
		} else {
			postLikeButton.src = '/static/img/unlike.png';
		}

		postLikeButton.dataset.postId = postData.post_id;
	}
	postLikeContainer.appendChild(postTime);
	postLikeContainer.appendChild(postLikeNumber);
	postLikeContainer.appendChild(postLikeButton);

	postInfo.appendChild(postLikeContainer);
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
		'justify-end'
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
		'font-medium',
		'w-full'
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

			await createPostContainer(postData[0]);
			postModal.classList.remove('hidden');

			const commentsData = await getCommentsData(post_id);
			await createCommentContainer(commentsData);

			await createPostLikeContainer(postData[0]);
			await createCommentForm(post_id);

			sendComment(post_id);

			postModal.addEventListener('click', (event) => {
				if (event.target === postModal) {
					postModal.classList.add('hidden');
				}
			});
		}
	});
}

function sendComment(post_id) {
	const commentForm = document.querySelector('.commentForm');
	const commentButton = commentForm.querySelector('.commentButton');

	commentButton.addEventListener('click', async function (event) {
		event.preventDefault();
		postComment(post_id);
		const commentText = commentForm.querySelector('.commentText');
		commentText.value = '';
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

function postComment(post_id) {
	const user_id = document.getElementById('userId').innerText;

	const commentBody = document.querySelector('.commentText').value;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const commentData = {
		user: user_id,
		post: post_id,
		body: commentBody,
	};

	fetch('comment/create/', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(commentData),
	})
		.then((response) => response.json())
		.then((data) => {
			appendNewComment(data);
		})

		.catch((error) => {
			console.error('創建評論時發生錯誤:', error);
		});
}

function appendNewComment(newCommentData) {
	const commentContainer = document.getElementById('commentContainer');

	const commenterInfo = document.createElement('div');
	commenterInfo.classList.add('flex', 'flex-row', 'py-2');
	const commentAvatar = document.createElement('img');
	commentAvatar.src = newCommentData.commenter_profile.avatar;
	commentAvatar.classList.add(
		'h-8',
		'w-8',
		'rounded-full',
		'ring-2',
		'ring-white'
	);

	const commentContent = document.createElement('div');
	commentContent.innerText = newCommentData.body;
	commentContent.classList.add('px-2');

	commenterInfo.appendChild(commentAvatar);
	commenterInfo.appendChild(commentContent);

	commentContainer.insertBefore(commenterInfo, commentContainer.firstChild);
}
