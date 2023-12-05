export function createPostsContainer(postsData) {
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
		postImage.dataset.postId = post.id;

		postContainer.appendChild(postImage);

		postsContainer.appendChild(postContainer);
	}
}

export function createPostContainer(postData, authorData) {
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
	authorInfo.id = 'authorInfo';
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
		'mx-2',
		'cursor-pointer'
	);
	authorAvatar.src = authorData.avatar;
	authorAvatar.dataset.slug = authorData.slug;

	const authorDetails = document.createElement('div');
	authorDetails.classList.add('flex', 'flex-col');

	const authorName = document.createElement('div');
	authorName.innerText = authorData.first_name;

	// const addAuthor = document.createElement('div');
	// addAuthor.id = 'addAuthor';
	// addAuthor.classList.add('text-rose-400', 'cursor-pointer', 'ml-auto');
	// addAuthor.dataset.authorId = postData.author;

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

	// authorInfo.appendChild(addAuthor);

	postInfo.appendChild(authorInfo);
	postInfo.appendChild(postContent);

	postContainer.appendChild(postImage);
	postContainer.appendChild(postInfo);

	postModal.appendChild(postContainer);
}

export function createCommentsContainer(commentsData) {
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
	if (Array.isArray(commentsData) && commentsData.length > 0) {
		commentsData.reverse().forEach((comment) => {
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
	} else if (commentsData.message === 'There is no comments.') {
		const noCommentsMessage = document.createElement('div');
		noCommentsMessage.innerText = '';
		commentContainer.appendChild(noCommentsMessage);
	} else {
		console.error('Error: Invalid commentsData structure.');
	}

	postInfo.appendChild(commentContainer);
}

export function createPostLikeContainer(postData, postTime, postLikeStatus) {
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

	const postTimeText = document.createElement('div');
	postTimeText.innerText = postTime;

	const postLike = document.createElement('div');
	postLike.classList.add('postLike', 'flex', 'flex-col', 'items-end');

	const postLikeNumber = document.createElement('div');
	postLikeNumber.classList.add('postLikeNumber', 'ml-auto', 'px-2');
	postLikeNumber.innerText = postData.liked.length + ' ' + 'Likes';

	const postLikeButton = document.createElement('img');

	postLikeButton.classList.add(
		'postLikeButton',
		'w-6',
		'h-6',
		'mx-2',
		'cursor-pointer'
	);

	if (postLikeStatus) {
		postLikeButton.src = '/static/img/like.png';
	} else {
		postLikeButton.src = '/static/img/unlike.png';
	}

	postLikeButton.dataset.postId = postData.post_id;

	postLikeContainer.appendChild(postTimeText);
	postLikeContainer.appendChild(postLikeNumber);
	postLikeContainer.appendChild(postLikeButton);

	postInfo.appendChild(postLikeContainer);
}

export function createCommentForm(postId) {
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
	commentSubmit.value = postId;

	commentForm.appendChild(commentText);
	commentForm.appendChild(commentButton);
	commentForm.appendChild(commentSubmit);

	postInfo.appendChild(commentForm);
}

export function createEditPostContainer() {
	const authorInfo = document.getElementById('authorInfo');
	const editPostContainer = document.createElement('div');
	editPostContainer.classList.add(
		'ml-auto',
		'flex',
		'items-end',
		'flex-col',
		'gap-2'
	);
	const updateButtton = document.createElement('div');
	updateButtton.innerText = 'Update';
	updateButtton.classList.add(
		'updatePost',
		'flex',
		'justify-center',
		'items-center',
		'text-white',
		'cursor-pointer',
		'bg-rose-300',
		'hover:bg-rose-500',
		'rounded',
		'w-24',
		'h-6'
	);
	const deleteButtton = document.createElement('div');
	deleteButtton.innerText = 'Delete';
	deleteButtton.classList.add(
		'deletePost',
		'flex',
		'justify-center',
		'items-center',
		'text-white',
		'cursor-pointer',
		'bg-slate-300',
		'hover:bg-slate-500',
		'rounded',
		'w-24',
		'h-6'
	);

	editPostContainer.appendChild(updateButtton);
	editPostContainer.appendChild(deleteButtton);

	authorInfo.appendChild(editPostContainer);
}

export async function createFriendStatusContainer(friendOptions) {
	const authorInfo = document.getElementById('authorInfo');
	if (friendOptions.length > 1) {
		const friendStatusContainer = document.createElement('div');
		friendStatusContainer.classList.add(
			'ml-auto',
			'flex',
			'items-end',
			'flex-col',
			'gap-2'
		);
		const acceptButtton = document.createElement('div');
		acceptButtton.innerText = 'Accept';
		acceptButtton.classList.add(
			'acceptFriend',
			'flex',
			'justify-center',
			'items-center',
			'text-white',
			'cursor-pointer',
			'bg-rose-300',
			'hover:bg-rose-500',
			'rounded',
			'w-24',
			'h-6'
		);
		const rejectButtton = document.createElement('div');
		rejectButtton.innerText = 'Reject';
		rejectButtton.classList.add(
			'rejectFriend',
			'flex',
			'justify-center',
			'items-center',
			'text-white',
			'cursor-pointer',
			'bg-slate-300',
			'hover:bg-slate-500',
			'rounded',
			'w-24',
			'h-6'
		);

		friendStatusContainer.appendChild(acceptButtton);
		friendStatusContainer.appendChild(rejectButtton);

		authorInfo.appendChild(friendStatusContainer);
	} else {
		const friendStatusContainer = document.createElement('div');
		friendStatusContainer.classList.add('ml-auto');

		if (friendOptions[0] == 'remove') {
			friendStatusContainer.innerText = 'Remove';
			friendStatusContainer.classList.add(
				'removeFriend',
				'cursor-pointer',
				'flex',
				'justify-center',
				'items-center',
				'bg-slate-300',
				'hover:bg-slate-400',
				'rounded',
				'w-24',
				'h-10'
			);
		} else if (friendOptions[0] == 'wait') {
			friendStatusContainer.innerText = 'Waiting approved';
			friendStatusContainer.classList.add(
				'flex',
				'justify-center',
				'items-center',
				'bg-slate-300',
				'rounded',
				'w-36',
				'h-10',
				'truncate',
				'cursor-default'
			);
		} else {
			friendStatusContainer.innerText = 'Add friend';
			friendStatusContainer.classList.add(
				'addFriend',
				'cursor-pointer',
				'flex',
				'justify-center',
				'items-center',
				'bg-rose-300',
				'hover:bg-rose-400',
				'rounded',
				'w-24',
				'h-10'
			);
		}

		authorInfo.appendChild(friendStatusContainer);
	}
}

export function createUpdatePostContainer() {
	const updateForm = document.getElementById('updateForm');
	updateForm.classList.add(
		'hidden',
		'bg-slate-300/50',
		'w-full',
		'h-full',
		'fixed',
		'flex',
		'justify-center',
		'items-center'
	);
	updateForm.style.zIndex = '60';
	const updateFormContainer = document.createElement('form');
	updateFormContainer.id = 'updateFormContainer';
	updateFormContainer.method = 'POST';
	updateFormContainer.enctype = 'multipart/form-data';
	updateFormContainer.classList.add(
		'max-w-xl',
		'rounded',
		'overflow-hidden',
		'shadow-lg',
		'px-4',
		'py-4',
		'grid',
		'gap-4',
		'bg-white'
	);

	const fileInput = document.createElement('input');
	fileInput.type = 'file';
	fileInput.name = 'image';
	fileInput.classList.add(
		'border-2',
		'border-gray-300',
		'py-2',
		'rounded-md'
	);

	const textArea = document.createElement('textarea');
	textArea.name = 'content';
	textArea.classList.add(
		'w-full',
		'py-4',
		'border-2',
		'border-gray-300',
		'rounded-md'
	);

	const flexContainer = document.createElement('div');
	flexContainer.classList.add('md:flex', 'justify-end');

	const submitButton = document.createElement('button');
	submitButton.id = 'submitPostButton';
	submitButton.classList.add(
		'bg-blue-500',
		'hover:bg-blue-700',
		'text-white',
		'font-bold',
		'py-2',
		'px-4',
		'rounded'
	);
	submitButton.type = 'submit';
	submitButton.innerText = 'Update Post';

	flexContainer.appendChild(submitButton);
	updateFormContainer.appendChild(fileInput);
	updateFormContainer.appendChild(textArea);
	updateFormContainer.appendChild(flexContainer);
	updateForm.appendChild(updateFormContainer);
}
