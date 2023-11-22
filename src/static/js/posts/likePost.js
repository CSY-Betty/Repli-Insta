import { getPostData } from './datafetch.js';

export async function likePost() {
	const postContainer = document.getElementById('postContainer');

	postContainer.addEventListener('click', async (event) => {
		const postLikeButton = event.target.closest('.postLikeButton');
		const post_id = postLikeButton?.getAttribute('data-post-id');
		if (post_id) {
			const likeStatus = await sendLike(post_id);
			if (likeStatus.value) {
				postLikeButton.src = '/static/img/like.png';
				const postLikeNumber =
					postContainer.querySelector('.postLikeNumber');
				const postData = await getPostData(post_id);
				postLikeNumber.innerText = '';
				postLikeNumber.innerText =
					postData[0].liked.length + ' ' + 'Likes';
			} else {
				postLikeButton.src = '/static/img/unlike.png';
				const postLikeNumber =
					postContainer.querySelector('.postLikeNumber');
				const postData = await getPostData(post_id);
				postLikeNumber.innerText = '';
				postLikeNumber.innerText =
					postData[0].liked.length + ' ' + 'Likes';
			}
		}
	});
}

function sendLike(post_id) {
	const url = `/posts/post/like/${post_id}/`;
	const originUrl = window.location.origin;
	const likeUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(likeUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: post_id,
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}
