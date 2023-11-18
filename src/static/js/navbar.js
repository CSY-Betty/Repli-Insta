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

function showPost() {
	const postButton = document.getElementById('postButton');
	const postDialog = document.getElementById('postDialog');

	postButton.addEventListener('click', function () {
		postDialog.showModal();
		createPost();
	});

	postDialog.addEventListener('click', function (event) {
		if (event.target === postDialog) {
			postDialog.close();
		}
	});
}

function createPost() {
	const postForm = document.getElementById('postForm');
	const submitPostButton = document.getElementById('submitPostButton');

	postForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(postForm);

		const csrfToken = formData.get('csrfmiddlewaretoken');

		const file = formData.get('image');

		const content = formData.get('content');

		const author = document.getElementById('userId').innerText;
		formData.append('author', author);

		const url = 'post/create/';

		fetch(url, {
			method: 'POST',
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

document.addEventListener('DOMContentLoaded', function () {
	dropdownMenu();
	showPost();
});
