import { getProfileBySlug, getProfileData } from './profilesData/profileCRU.js';

import {
	createProfileContainer,
	createFriendStatusContainer,
} from './profiles/profileContainer.js';

import {
	getPostsData,
	getPostData,
	updatePost,
	deletePost,
} from './postsData/postsCRUD.js';

import { getCommentsData, createComment } from './postsData/commentsCR.js';

import {
	createPostsContainer,
	createPostContainer,
	createCommentsContainer,
	createPostLikeContainer,
	createCommentForm,
	createEditPostContainer,
	createUpdatePostContainer,
} from './posts/postsContainer.js';

import { updateLike } from './postsData/likesRU.js';

import {
	timeCalculate,
	checkPostLikeStatus,
	getFriendshipActionWithAuthor,
} from './posts/utils.js';

import {
	getFriendsData,
	addFriend,
	acceptRejectFriend,
	removeFriend,
} from './profilesData/friendsCRUD.js';

import { checkLogin } from './auth/logStatus.js';

async function renderProfileInfo(profileData, userData) {
	createProfileContainer(profileData);
	if (userData) {
		const userIsAuthor = userData.user === profileData.user;
		if (!userIsAuthor) {
			const friendStatus = await getFriendsData();
			const friendOptions = getFriendshipActionWithAuthor(
				profileData.user,
				friendStatus
			);
			createFriendStatusContainer(friendOptions);
		}
	}
}

function renderPosts(profileData) {
	getPostsData(profileData.user).then((postsData) => {
		createPostsContainer(postsData);
	});
	createUpdatePostContainer();
}

async function renderPost(userData) {
	const postsContainer = document.getElementById('postsContainer');
	const postModal = document.getElementById('postModal');

	postsContainer.addEventListener('click', handlePostImageClick);

	async function handlePostImageClick(event) {
		const clickImage = event.target.closest('.post_image');
		const postId = clickImage?.getAttribute('data-post-id');

		if (postId) {
			await renderPostDetails(postId, userData);
		}
	}

	async function renderPostDetails(postId, userData) {
		try {
			const postData = await getPostData(postId);
			const authorData = await getProfileData(postData.author);
			const commentsData = await getCommentsData(postId);

			const postTime = await timeCalculate(postData.created);

			let postLikeStatus;
			if (userData) {
				postLikeStatus = await checkPostLikeStatus(postData, userData);
			} else {
				postLikeStatus = false;
			}
			clearPostModal();
			await createPostContainer(postData, authorData);

			postModal.classList.remove('hidden');

			if (userData) {
				const userIsAuthor = userData.user === postData.author;
				if (!userIsAuthor) {
					await Promise.all([
						createCommentsContainer(commentsData),
						createPostLikeContainer(
							postData,
							postTime,
							postLikeStatus
						),
						createCommentForm(postId),
					]);
				} else {
					await Promise.all([
						createCommentsContainer(commentsData),
						createPostLikeContainer(
							postData,
							postTime,
							postLikeStatus
						),
						createCommentForm(postId),
						createEditPostContainer(),
					]);
				}
			} else {
				await Promise.all([
					createCommentsContainer(commentsData),
					createPostLikeContainer(postData, postTime, postLikeStatus),
					createCommentForm(postId),
				]);
			}

			setEventListeners(postId, userData, authorData);
		} catch (error) {
			console.error('Error rendering post details:', error);
		}
	}

	function clearPostModal() {
		postModal.innerHTML = '';
	}

	function setEventListeners(postId, userData, authorData) {
		addPostEventListeners(postId, userData, authorData);

		postModal.addEventListener('click', handlePostModalClick);
	}

	function addPostEventListeners(postId, userData, authorData) {
		const postContainer = document.getElementById('postContainer');

		postContainer.addEventListener('click', (event) => {
			const postLikeButton = event.target.closest('.postLikeButton');
			const authorAvatar = event.target.closest('.authorAvatar');
			const commentButton = event.target.closest('.commentButton');

			const updatePostButton = event.target.closest('.updatePost');
			const deletePostButton = event.target.closest('.deletePost');

			const acceptFriendButton = event.target.closest('.acceptFriend');
			const rejectFriendButton = event.target.closest('.rejectFriend');
			const removeFriendButton = event.target.closest('.removeFriend');
			const addFriendButton = event.target.closest('.addFriend');

			if (postLikeButton && userData) {
				likePost(postId, postLikeButton);
			} else if (authorAvatar) {
				visitAuthor(authorData);
			} else if (commentButton && userData) {
				event.preventDefault();
				sendComment(postId, userData);
			} else if (updatePostButton) {
				const updateForm = document.getElementById('updateForm');
				updateForm.classList.remove('hidden');
				updateForm.addEventListener('click', (event) =>
					handleUpdateFormClick(postId, event)
				);
			} else if (deletePostButton) {
				deletePost(postId);
				location.reload();
			} else if (acceptFriendButton) {
				acceptRejectFriend(authorData.user, 'accept');
				location.reload();
			} else if (rejectFriendButton) {
				acceptRejectFriend(authorData.user, 'reject');
				location.reload();
			} else if (removeFriendButton) {
				removeFriend(authorData.user);
				location.reload();
			} else if (addFriendButton) {
				addFriend(authorData.user);
				location.reload();
			}
		});
	}

	function handlePostModalClick(event) {
		if (event.target === postModal) {
			postModal.classList.add('hidden');
		}
	}
}

async function handleUpdateFormClick(postId, event) {
	if (event.target === updateForm) {
		updateForm.classList.add('hidden');
	}
	if (event.target === submitPostButton) {
		event.preventDefault();
		const formData = new FormData(updateFormContainer);
		await updatePost(postId, formData);
		location.reload();
	}
}

function sendComment(postId, userData) {
	const commentForm = document.querySelector('.commentForm');
	const commentBody = commentForm.querySelector('.commentText').value;

	createComment(postId, commentBody);

	commentForm.querySelector('.commentText').value = '';

	appendNewComment(commentBody, userData);
}

function appendNewComment(commentBody, userData) {
	const commentContainer = document.getElementById('commentContainer');

	const commenterInfo = document.createElement('div');
	commenterInfo.classList.add('flex', 'flex-row', 'py-2');
	const commentAvatar = document.createElement('img');
	commentAvatar.src = userData.avatar;
	commentAvatar.classList.add(
		'h-8',
		'w-8',
		'rounded-full',
		'ring-2',
		'ring-white'
	);

	const commentContent = document.createElement('div');
	commentContent.innerText = commentBody;
	commentContent.classList.add('px-2');

	commenterInfo.appendChild(commentAvatar);
	commenterInfo.appendChild(commentContent);

	commentContainer.insertBefore(commenterInfo, commentContainer.firstChild);
}

async function likePost(postId, postLikeButton) {
	await updateLike(postId);

	const originUrl = window.location.origin;

	if (postLikeButton.src == `${originUrl}/static/img/like.png`) {
		postLikeButton.src = `${originUrl}/static/img/unlike.png`;
	} else if (postLikeButton.src == `${originUrl}/static/img/unlike.png`) {
		postLikeButton.src = `${originUrl}/static/img/like.png`;
	}

	const postLikeNumber = postContainer.querySelector('.postLikeNumber');
	const postData = await getPostData(postId);
	postLikeNumber.innerText = `${postData.liked.length} Likes`;
}

function visitAuthor(authorData) {
	const slug = authorData.slug;
	window.location.href = '/profiles/' + slug;
}

async function checkUser() {
	const user = await checkLogin();
	if (user.user_id != 999) {
		return await getProfileData(user.user_id);
	}
	return null;
}

document.addEventListener('DOMContentLoaded', async function () {
	const profileData = await getProfileBySlug();
	const userData = await checkUser();

	renderProfileInfo(profileData, userData);
	renderPosts(profileData);
	renderPost(userData);
});
