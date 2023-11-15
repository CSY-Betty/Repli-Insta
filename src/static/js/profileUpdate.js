document.addEventListener('DOMContentLoaded', function () {
	const updateForm = document.getElementById('updateForm');
	const changeAvatarButton = document.getElementById('changeAvatar');
	const avatarInput = document.getElementById('avatarInput');

	changeAvatarButton.addEventListener('click', function (event) {
		event.preventDefault();
		avatarInput.click();
	});

	avatarInput.addEventListener('click', function (event) {
		avatarInput.value = '';
	});

	updateForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(updateForm);
		const url = updateForm.action;

		fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then(() => location.reload())
			.catch((error) => {
				console.error('Error:', error);
			});
	});
});
