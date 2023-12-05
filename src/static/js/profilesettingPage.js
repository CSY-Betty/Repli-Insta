import { user } from './navbar.js';
import { updateProfile } from './profilesData/profileCRU.js';

function changeAvatar() {
	const changeAvatarButton = document.getElementById('changeAvatarButton');
	const avatarInput = document.getElementById('avatarInput');

	changeAvatarButton.addEventListener('click', function (event) {
		event.preventDefault();
		avatarInput.click();
	});
}

function sendNewProfile() {
	const updateForm = document.getElementById('updateForm');

	updateForm.addEventListener('submit', async function (event) {
		event.preventDefault();

		const formData = new FormData(updateForm);

		const formFields = updateForm.elements;

		for (const field of formFields) {
			if (field.type !== 'file' && field.value.trim() === '') {
				formData.delete(field.name);
			}
		}

		await updateProfile(user.user_id, formData);
		window.location.reload();
	});
}

document.addEventListener('loginStatusChecked', function () {
	changeAvatar();
	sendNewProfile();
});
