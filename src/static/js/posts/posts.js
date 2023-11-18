import { postComment } from './comment.js';
import { getPosts, getPostData, getCommentsData } from './datafetch.js';

async function renderCenterPosts() {
	const postsData = await getPosts();
	const postsContainer = document.getElementById('postsContainer');
	postsContainer.classList.add('pt-4', 'grid', 'grid-cols-3', 'gap-4');

	postsData.forEach((post) => {
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
			'items-center'
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
		authorData.classList.add('px-2');

		const authorName = document.createElement('div');
		authorName.innerText = post.author_profile.first_name;

		const postTime = document.createElement('div');
		postTime.classList.add('text-xs');
		let time = timeCalculate(post.created);
		postTime.innerText = time;

		const postContent = document.createElement('div');
		postContent.classList.add('px-6', 'py-4', 'text-gray-700', 'text-base');
		postContent.innerText = post.content;

		authorInfo.appendChild(authorAvatar);
		authorData.appendChild(authorName);
		authorData.appendChild(postTime);

		authorInfo.appendChild(authorData);

		postContainer.appendChild(postImage);
		postContainer.appendChild(authorInfo);
		postContainer.appendChild(postContent);

		postsContainer.appendChild(postContainer);
	});
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
