document.addEventListener('DOMContentLoaded', function () {
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
});

document.addEventListener('DOMContentLoaded', function () {
	const postButton = document.getElementById('postButton');
	const postDialog = document.getElementById('postDialog');

	postButton.addEventListener('click', function () {
		postDialog.showModal();
	});

	postDialog.addEventListener('click', function (event) {
		if (event.target === postDialog) {
			postDialog.close();
		}
	});
});
