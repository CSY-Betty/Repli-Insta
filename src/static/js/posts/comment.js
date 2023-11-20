export function postComment(post_id) {
	const commentForm = document.querySelector('.commentForm');
	const commentButton = document.querySelector('.commentButton');

	commentButton.addEventListener('click', function (event) {
		event.preventDefault();

		const user_id = document.getElementById('userId').innerText;

		const commentBody = document.querySelector('.commentText').value;

		const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
			.value;

		const commentData = {
			user: user_id,
			post: post_id,
			body: commentBody,
		};
		console.log(commentData);

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
				window.location.reload();
			})
			.catch((error) => {
				console.error('創建評論時發生錯誤:', error);
			});
	});
}
