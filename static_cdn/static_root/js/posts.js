document.addEventListener('DOMContentLoaded', function () {
	const likeForms = document.getElementsByClassName('like-form');

	for (let i = 0; i < likeForms.length; i++) {
		const likeForm = likeForms[i];
		const likeButton = likeForm.querySelector('.like-btn');

		likeButton.addEventListener('click', function (event) {
			event.preventDefault();
			const postId = likeForm.id;
			const likeText = likeButton.innerText;
			const url = likeForm.action;

			let res;
			let likesCount = likeForm.querySelector('.like-count');
			const likesAsNumber = parseInt(likesCount.innerText);

			let csrfToken = likeForm.querySelector(
				'input[name=csrfmiddlewaretoken]'
			).value;

			const requestData = new URLSearchParams();
			requestData.append('csrfmiddlewaretoken', csrfToken);
			requestData.append('post_id', postId);

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: requestData,
			})
				.then((response) => response.json())
				.then(function (data) {
					if (likeText === 'Unlike') {
						likeButton.innerText = 'Like';
						res = likesAsNumber - 1;
					} else {
						likeButton.innerText = 'Unlike';
						res = likesAsNumber + 1;
					}
					likesCount.innerText = res;
				})
				.catch((response) => console.log('erroe', response));
		});
	}
});

document.addEventListener('DOMContentLoaded', function () {
	const allPosts = document.getElementById('allPosts');
	allPosts.addEventListener('click', function (event) {
		const clickedPost = event.target.closest('.eachPost');
		const postId = clickedPost.getAttribute('value');
		const urlWithParams = `get-post?post_id=${postId}`;

		fetch(urlWithParams, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then(function (data) {
				const postToShow = document.getElementById('postToShow');

				const imageElement = postToShow.querySelector('img');
				imageElement.src = '/media/' + data.post.image_url;
				const postToShowAvatar =
					document.getElementById('postToShowAvatar');
				postToShowAvatar.src = '/media/' + data.profile.avatar;
				const postToShowAuthor =
					document.getElementById('postToShowAuthor');
				postToShowAuthor.innerText = data.profile.first_name;
				const postToShowContent =
					document.getElementById('postToShowContent');
				postToShowContent.innerText = data.post.content;

				const postIdInput = document.querySelector(
					'input[name="post_id"]'
				);
				postIdInput.value = postId;

				postToShow.classList.remove('hidden');
			})
			.catch((response) => console.log('error', response));

		const commentUrl = `get-comment?post_id=${postId}`;
		const postCommentContainer = postToShow.querySelector('.postComment');
		fetch(commentUrl, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		})
			.then((response) => response.json())
			.then(function (data) {
				console.log(data.comments);

				// 清空評論容器，以防止重複插入
				postCommentContainer.innerHTML = '';

				// 迴圈處理每個評論
				data.comments.forEach((comment) => {
					const commentElement = document.createElement('div');
					commentElement.innerHTML = `
						<div class="flex flex-row py-2">
						<img src="${comment.commenter_avatar}" class="h-8 w-8 rounded-full ring-2 ring-white">
						<p>${comment.content}</p>
						</div>
						
					`;

					postCommentContainer.appendChild(commentElement);
				});
			})
			.catch((error) => console.log('error', error));
	});
});

document.addEventListener('DOMContentLoaded', function () {
	const commentForm = document.querySelector('.comment-form');

	commentForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const url = commentForm.action;
		console.log(url);
		const postIdInput = document.querySelector('input[name="post_id"]');
		postId = postIdInput.value;

		const formData = new FormData(commentForm);

		let csrfToken = commentForm.querySelector(
			'input[name=csrfmiddlewaretoken]'
		).value;

		formData.append('submmit_comment', 'submmit_comment');
		formData.append('post_id', postId);

		fetch(url, {
			method: 'POST',
			headers: {
				'X-CSRFTOKEN': csrfToken,
			},
			body: formData,
		})
			.then((response) => response.json())
			.then(function (data) {
				window.location.href = window.location.href;
			})
			.catch((response) => console.log('error', response));
	});
});
