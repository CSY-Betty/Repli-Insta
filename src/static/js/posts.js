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

// show post
// document.addEventListener('DOMContentLoaded', function () {
// 	const allPosts = document.getElementById('allPosts');
// 	allPosts.addEventListener('click', function (event) {
// 		const clickedPost = event.target.closest('.eachPost');
// 		const postId = clickedPost.getAttribute('value');

// 		const urlWithParams = `get-post?post_id=${postId}`;

// 		fetch(urlWithParams, {
// 			method: 'GET',
// 			headers: { 'Content-Type': 'application/json' },
// 		})
// 			.then((response) => response.json())
// 			.then(function (data) {
// 				const postToShow = document.getElementById('postToShow');
// 				const imageElement = postToShow.querySelector('img');
// 				imageElement.src = '/media/' + data.post.image_url;
// 				const postToShowAvatar =
// 					document.getElementById('postToShowAvatar');
// 				postToShowAvatar.src = '/media/' + data.profile.avatar;
// 				const postToShowAuthor =
// 					document.getElementById('postToShowAuthor');
// 				postToShowAuthor.innerText = data.profile.first_name;
// 				const postToShowContent =
// 					document.getElementById('postToShowContent');
// 				postToShowContent.innerText = data.profile.content;
// 				postToShow.showModal();
// 				console.log(data.profile.first_name);
// 			})
// 			.catch((response) => console.log('erroe', response));
// 	});
// });
