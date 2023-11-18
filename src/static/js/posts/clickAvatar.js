async function directToProfile() {
	const postsContainer = document.getElementById('postsContainer');

	postsContainer.addEventListener('click', async (event) => {
		const clickImage = event.target.closest('.authorAvatar');
		const authorProfile = clickImage?.getAttribute('data-author-slug');

		if (authorProfile) {
			const url = `${window.location.origin}/profiles/${authorProfile}`;
			window.location.href = url;
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	directToProfile();
});
