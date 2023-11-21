import { checkLogin } from './auth/logStatus.js';

function dropdownMenu() {
	const button = document.getElementById('dropdownHoverButton');
	const dropdown = document.getElementById('dropdownHover');

	function showDropdown() {
		dropdown.classList.remove('hidden');
	}

	function hideDropdown() {
		dropdown.classList.add('hidden');
	}

	button.addEventListener('mouseenter', showDropdown);

	button.addEventListener('mouseleave', hideDropdown);

	dropdown.addEventListener('mouseenter', showDropdown);

	dropdown.addEventListener('mouseleave', hideDropdown);
}

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

		const author = document.getElementById('userId').innerText;
		formData.append('author', author);

		const url = '/posts/post/create/';
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

async function checkLoginStatus() {
	const user = await checkLogin();
	if (user.user_id != 999) {
		dropdownMenu();
		showWritePostForm();
	}
}

document.addEventListener('DOMContentLoaded', function () {
	checkLoginStatus();
});
