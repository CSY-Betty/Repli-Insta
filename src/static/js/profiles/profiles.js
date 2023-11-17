function getAllProfiles() {
	const url = `all-profiles/`;

	return fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
	}).then((response) => response.json());
}

async function renderProfiles() {
	profilesData = await getAllProfiles();
	console.log('profilesData', profilesData);
	const allProfiles = document.getElementById('allProfiles');

	profilesData.forEach((profile) => {
		const someoneData = document.createElement('div');
		someoneData.classList.add(
			'someoneData',
			'p-4',
			'my-4',
			'w-full',
			'lg:max-w-full',
			'lg:flex',
			'flex-row',
			'items-center',
			'border',
			'border-gray-400',
			'rounded'
		);

		const someoneAvatar = document.createElement('img');
		someoneAvatar.classList.add(
			'someoneAvatar',
			'basis-1/5',
			'rounded-full',
			'overflow-hidden'
		);
		someoneAvatar.src = profile.avatar;

		const someoneInfo = document.createElement('div');
		someoneInfo.classList.add(
			'basis-3/5',
			'px-4',
			'flex',
			'flex-col',
			'justify-between',
			'leading-normal'
		);
		const someoneName = document.createElement('div');
		someoneName.classList.add(
			'someoneName',
			'text-gray-900',
			'font-bold',
			'text-l',
			'mb-2'
		);
		someoneName.innerText = profile.first_name;

		const someoneBio = document.createElement('div');
		someoneBio.classList.add('someoneBio', 'text-gray-700', 'text-base');
		someoneBio.innerText = profile.bio;

		const someoneAddFriend = document.createElement('button');
		someoneAddFriend.classList.add(
			'someoneAddFriend',
			'asis-1/5',
			'bg-blue-500',
			'hover:bg-blue-700',
			'text-white',
			'font-bold',
			'py-2',
			'px-4',
			'rounded'
		);
		someoneAddFriend.value = profile.user;
		someoneAddFriend.innerText = 'Add Friends';

		someoneInfo.appendChild(someoneName);
		someoneInfo.appendChild(someoneBio);

		someoneData.appendChild(someoneAvatar);
		someoneData.appendChild(someoneInfo);
		someoneData.appendChild(someoneAddFriend);

		allProfiles.appendChild(someoneData);
	});
}

function addFriend() {
	const allProfiles = document.getElementById('allProfiles');
	console.log(allProfiles);
	const someoneDataList = allProfiles.querySelectorAll('.someoneData');
	console.log(someoneDataList.length);

	allProfiles.addEventListener('click', function (event) {
		if (event.target.classList.contains('someoneAddFriend')) {
			const buttonValue = event.target.value;
			console.log(buttonValue);
		}
	});
}

document.addEventListener('DOMContentLoaded', function () {
	renderProfiles();
	addFriend();
});
