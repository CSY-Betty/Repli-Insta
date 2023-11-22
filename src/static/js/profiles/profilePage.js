import { checkLogin } from '../auth/logStatus.js';
import { getRelationData } from './datafetch.js';
import { addFriend, accept, reject } from './addFriend.js';
import { getPostData } from '../posts/datafetch.js';

import { getCommentsData } from '../posts/datafetch.js';

import { likePost } from '../posts/likePost.js';
import { updateThePost, deleteThePost } from '../posts/updatePost.js';

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
	profileInfo.classList.add(
		'flex',
		'flex-row',
		'mr-48',
		'ml-96',
		'border-b',
		'py-4',
		'pl-16'
	);

	const profileAvatar = document.createElement('img');
	profileAvatar.classList.add(
		'h-36',
		'w-36',
		'rounded-full',
		'ring-2',
		'ring-white'
	);
	profileAvatar.src = profileData.avatar;

	const profileDetail = document.createElement('div');
	profileDetail.classList.add('flex', 'flex-col', 'my-4', 'px-12');

	const profileName = document.createElement('div');
	profileName.innerText =
		profileData.first_name + ' ' + profileData.last_name;

	const profileBio = document.createElement('div');
	profileBio.classList.add('my-6');
	profileBio.innerText = profileData.bio;

	const otherInfo = document.createElement('div');

	if (user.user_id != profileData.user) {
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

			otherInfo.appendChild(friendButton);
		}
	}

	profileDetail.appendChild(profileName);
	profileDetail.appendChild(profileBio);

	profileInfo.appendChild(profileAvatar);
	profileInfo.appendChild(profileDetail);
	profileInfo.appendChild(otherInfo);
}

async function renderPosts() {
	const profileData = await getProfile();
	const posts = profileData.posts;
	createPostsContainer(posts);
}

async function createPostsContainer(posts) {
	const postsContainer = document.getElementById('postsContainer');
	postsContainer.classList.add(
		'ml-96',
		'mr-48',
		'pt-8',
		'grid',
		'gap-4',
		'grid-cols-3'
	);

	for (const post of posts) {
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
		postImage.dataset.postId = post.id;

		postContainer.appendChild(postImage);

		postsContainer.appendChild(postContainer);
	}
}

async function renderPost() {
	const postsContainer = document.getElementById('postsContainer');
	const postModal = document.getElementById('postModal');

	postsContainer.addEventListener('click', async (event) => {
		const clickImage = event.target.closest('.post_image');
		const post_id = clickImage?.getAttribute('data-post-id');
		if (post_id) {
			const postData = await getPostData(post_id);
			const user = await checkLogin();

			postModal.innerHTML = ''; // 清空内容

			await createPostContainer(postData[0]);
			postModal.classList.remove('hidden');

			const commentsData = await getCommentsData(post_id);
			await createCommentContainer(commentsData);

			await createPostLikeContainer(postData[0]);
			await createCommentForm(post_id);

			sendComment(post_id);
			if (user.user_id != postData[0].author) {
				friendUpdate(user.user_id, postData[0]);
			} else {
				postUpdate(post_id);
			}

			likePost(postData[0]);

			postModal.addEventListener('click', (event) => {
				if (event.target === postModal) {
					postModal.classList.add('hidden');
				}
			});
		}
	});
}

// async function friendButtonClick() {
// 	const friendButton = document.getElementById('friendButton');
// 	const profileData = await getProfile();
// 	const profileId = profileData.user;

// 	friendButton.addEventListener('click', function (event) {
// 		const buttonValue = event.target.textContent;
// 		if (buttonValue === 'Friends') {
// 			const url = '/profiles/profile/friends/';
// 			const originUrl = window.location.origin;
// 			const friendsUrl = `${originUrl}${url}`;
// 			window.location.href = friendsUrl;
// 		}

// 		if (buttonValue === 'Add friend') {
// 			addFriend(profileId).then(() => window.location.reload());
// 		}

// 		if (buttonValue === 'Accept') {
// 			accept(profileId).then(() => window.location.reload());
// 		}

// 		if (buttonValue === 'Reject') {
// 			reject(profileId).then(() => window.location.reload());
// 		}
// 	});
// }

document.addEventListener('DOMContentLoaded', function () {
	renderProfileInfo();
	renderPosts();
	renderPost();
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

async function createPostContainer(postData) {
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
	postContainer.id = 'postContainer';

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
	addAuthor.id = 'addAuthor';
	addAuthor.classList.add('text-rose-400', 'cursor-pointer', 'ml-auto');
	addAuthor.dataset.authorId = postData.author;

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

async function friendUpdate(user, postData) {
	const relation = await checkRelation(user, postData);

	const addAuthor = document.getElementById('addAuthor');
	if (relation === 'myself' || relation === null) {
		addAuthor.innerText = '';
	} else if (relation === 'wait') {
		addAuthor.innerText = 'Wait approve';
		addAuthor.classList.remove('cursor-pointer');
	} else if (relation === 'addfriend') {
		addAuthor.innerText = 'Add friend';
	} else {
		const acceptButton = document.createElement('div');
		acceptButton.classList.add('hover:bg-slate-200/50', 'px-2', 'py-1');
		acceptButton.innerText = 'Accept';
		const rejectButton = document.createElement('div');
		rejectButton.classList.add('hover:bg-slate-200/50', 'px-2', 'py-1');
		rejectButton.innerText = 'Reject';

		addAuthor.appendChild(acceptButton);
		addAuthor.appendChild(rejectButton);
	}
}

async function checkRelation(user_id, postData) {
	const friendships = await getRelationData();

	if (user_id != 999) {
		const status = getStatus(user_id, postData.author, friendships);
		return status;
	} else {
		return null;
	}

	function getStatus(user_id, author, relationships) {
		const relationship = relationships.find(
			(item) =>
				(item.sender === user_id && item.receiver === author) ||
				(item.sender === author && item.receiver === user_id)
		);

		if (relationship) {
			return user_id === relationship.sender ? 'wait' : 'check';
		}

		if (
			!relationships.some(
				(item) => item.sender === author || item.receiver === author
			)
		) {
			return 'addfriend';
		}

		return 'myself';
	}
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

	const url = '/posts/comment/create/';
	const originUrl = window.location.origin;
	const postCommentUrl = `${originUrl}${url}`;

	fetch(postCommentUrl, {
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

async function postUpdate(post_id) {
	const addAuthor = document.getElementById('addAuthor');

	const updateButton = document.createElement('div');
	updateButton.classList.add('hover:bg-slate-200/50', 'px-2', 'py-1');
	updateButton.innerText = 'Update';
	const deleteButton = document.createElement('div');
	deleteButton.classList.add('hover:bg-slate-200/50', 'px-2', 'py-1');
	deleteButton.innerText = 'Delete';

	addAuthor.appendChild(updateButton);
	addAuthor.appendChild(deleteButton);

	updatePost(post_id);
}

function updatePost(post_id) {
	const addAuthor = document.getElementById('addAuthor');

	addAuthor.addEventListener('click', function (event) {
		if (event.target.innerText === 'Update') {
			const updateForm = document.getElementById('updateForm');
			updateForm.classList.remove('hidden');
			submitUpdateForm(post_id);
		} else if (event.target.innerText === 'Delete') {
			deleteThePost(post_id).then(window.location.reload());
		}
	});
}

function submitUpdateForm(post_id) {
	const updateForm = document.getElementById('updateForm');
	updateForm.style.zIndex = '60';
	const updateFormContainer = document.getElementById('updateFormContainer');

	updateFormContainer.addEventListener('submit', function (event) {
		event.preventDefault();
		const formData = new FormData(updateFormContainer);
		updateThePost(post_id, formData).then(window.location.reload());
	});
}
