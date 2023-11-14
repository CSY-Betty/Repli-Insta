document.addEventListener('DOMContentLoaded', function () {
	const settingUpdateForm = document.getElementById('myprofilesetting');
	const changeAvatarButton = document.getElementById('changeAvatar');
	const avatarInput = document.getElementById('avatarInput');

	changeAvatarButton.addEventListener('click', function () {
		// 触发文件上传输入框的点击事件
		avatarInput.click();
	});

	avatarInput.addEventListener('change', function () {
		const selectedFile = avatarInput.files[0];
		console.log('Selected File:', selectedFile);
		avatarInput.value = '';
	});

	settingUpdateForm.addEventListener('submit', function (event) {
		event.preventDefault();

		const formData = new FormData(settingUpdateForm);
		const url = settingUpdateForm.action;

		// 使用 Fetch API 发送表单数据
		fetch(url, {
			method: 'POST',
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				// 处理成功的响应
				console.log(data);
			})
			.catch((error) => {
				// 处理错误
				console.error('Error:', error);
			});
	});
});
