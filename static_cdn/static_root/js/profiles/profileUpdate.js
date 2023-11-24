function changeAvatar() {
	const changeAvatarButton = document.getElementById('changeAvatarButton');
	const avatarInput = document.getElementById('avatarInput');

	changeAvatarButton.addEventListener('click', function (event) {
		event.preventDefault();
		avatarInput.click();
	});
}

function updateProfile() {
	const updateForm = document.getElementById('updateForm');

	updateForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(updateForm);

		const csrfToken = formData.get('csrfmiddlewaretoken');

		const file = formData.get('avatar');
		const first_name = formData.get('avafirst_nametar');
		const last_name = formData.get('last_name');

		const content = formData.get('bioUpdate');

		const userId = document.getElementById('userId').innerText;
		formData.append('user', userId);

		console.log(formData);

		const url = 'update/';

		fetch(url, {
			method: 'PUT',
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

document.addEventListener('DOMContentLoaded', function () {
	changeAvatar();
	updateProfile();
});
