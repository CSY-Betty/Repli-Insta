import { checkLogin } from './auth/logStatus.js';

function showWritePostForm() {
	const postButton = document.getElementById('postButton');
	const writePostDialog = document.getElementById('writePostDialog');

	postButton.addEventListener('click', function () {
		writePostDialog.showModal();
		writePost();
	});

	writePostDialog.addEventListener('click', function (event) {
		if (event.target === writePostDialog) {
			writePostDialog.close();
		}
	});
}

function writePost() {
	const postForm = document.getElementById('postForm');

	postForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(postForm);

		const csrfToken = formData.get('csrfmiddlewaretoken');

		const url = '/posts/test/';
		const originUrl = window.location.origin;
		const postUrl = `${originUrl}${url}`;

		fetch(postUrl, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken,
			},

			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				window.location.reload();
			})

			.catch((error) => {
				console.error('提交表單時發生錯誤:', error);
			});
	});
}

let user;
const loginStatusEvent = new Event('loginStatusChecked');

async function checkLoginStatus() {
	user = await checkLogin();
	if (user.user_id != 999) {
		showWritePostForm();
	}
	document.dispatchEvent(loginStatusEvent);
}

document.addEventListener('DOMContentLoaded', function () {
	checkLoginStatus();
});

export { user };
