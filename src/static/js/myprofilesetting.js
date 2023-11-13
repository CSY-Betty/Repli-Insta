// document.addEventListener('DOMContentLoaded', function () {
// 	const settingUpdateForm = document.getElementById('myprofilesetting');

// 	settingUpdateForm.addEventListener('submit', function (event) {
// 		event.preventDefault();
// 		const firstName = document.getElementById('firstNameUpdate').value;
// 		const lastName = document.getElementById('lastNameUpdate').value;
// 		const bio = document.getElementById('bioUpdate').value;

// 		const url = settingUpdateForm.action;
// 		console.log(settingUpdateForm);
// 		console.log('First Name:', firstName);
// 		console.log('Last Name:', lastName);
// 		console.log('Bio:', bio);
// 		console.log(url);

// 		let csrfToken = settingUpdateForm.querySelector(
// 			'input[name=csrfmiddlewaretoken]'
// 		).value;

// 		const requestData = new URLSearchParams();
// 		requestData.append('csrfmiddlewaretoken', csrfToken);
// 		requestData.append('first_name', firstName);
// 		requestData.append('last_name', lastName);
// 		requestData.append('bio', bio);

// 		// 使用 Fetch API 發送表單數據
// 		fetch(url, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/x-www-form-urlencoded',
// 			},
// 			body: requestData,
// 		})
// 			.then((response) => response.json())
// 			.then((data) => {
// 				// 處理成功的回應
// 				console.log(data);
// 			})
// 			.catch((error) => {
// 				// 處理錯誤
// 				console.error('Error:', error);
// 			});
// 	});
// });

document.addEventListener('DOMContentLoaded', function () {
	const settingUpdateForm = document.getElementById('myprofilesetting');

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
