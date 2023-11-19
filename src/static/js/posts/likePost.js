// import { checkLogin } from '../auth/logStatus.js';

async function likePost() {
	const postsContainer = document.getElementById('postsContainer');

	postsContainer.addEventListener('click', async (event) => {
		const postLikeButton = event.target.closest('.postLikeButton');
		const post_id = postLikeButton?.getAttribute('data-post-id');
		console.log(post_id);
		if (post_id) {
			// const user = await checkLogin();

			const url = `/posts/post/like/${post_id}/`;
			const originUrl = window.location.origin;
			const likeUrl = `${originUrl}${url}`;

			const csrfToken = document.getElementsByName(
				'csrfmiddlewaretoken'
			)[0].value;

			fetch(likeUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken,
				},
				body: post_id,
			})
				.then((response) => response.json())
				.then((data) => {
					window.location.reload();
				})
				.catch((error) => {
					console.error(error.message);
				});
		}
	});
}

document.addEventListener('renderComplete', function () {
	likePost();
});
