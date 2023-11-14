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
			console.log(url);

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
		console.log(clickedPost);
		console.log(postId);
	});
});
