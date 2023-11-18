export function checkLogin() {
	const url = '/check-login/';
	const checkLoginUrl = `${window.location.origin}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	return fetch(checkLoginUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		credentials: 'same-origin',
	})
		.then((response) => response.json())
		.then((data) => {
			return data;
		})
		.catch((error) => {
			console.error(error.message);
		});
}
