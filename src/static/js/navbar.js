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
	// const closeDialogButton = document.getElementById('closeDialogButton');

	// 顯示對話框的函數
	function showDialog() {
		postDialog.showModal();
	}

	// 關閉對話框的函數
	function closeDialog() {
		postDialog.close();
	}

	// 點擊"Settings"按鈕時顯示對話框
	postButton.addEventListener('click', showDialog);

	// // 點擊對話框內的"Close"按鈕時關閉對話框
	// closeDialogButton.addEventListener('click', closeDialog);
});
