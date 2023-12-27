export function createProfileContainer(profileData) {
	const profileInfo = document.getElementById('profileInfo');

	profileInfo.classList.add(
		'flex',
		'flex-row',
		'mr-48',
		'ml-96',
		'border-b',
		'py-4',
		'pl-16'
	);

	const profileAvatar = document.createElement('img');
	profileAvatar.classList.add(
		'h-36',
		'w-36',
		'rounded-full',
		'ring-2',
		'ring-white'
	);
	profileAvatar.src = profileData.avatar;

	const profileDetail = document.createElement('div');
	profileDetail.classList.add('flex', 'flex-col', 'my-4', 'px-12');

	const profileName = document.createElement('div');
	profileName.innerText =
		profileData.first_name + ' ' + profileData.last_name;

	const profileBio = document.createElement('div');
	profileBio.classList.add('my-6');
	profileBio.innerText = profileData.bio;

	profileDetail.appendChild(profileName);
	profileDetail.appendChild(profileBio);

	profileInfo.appendChild(profileAvatar);
	profileInfo.appendChild(profileDetail);
}

export async function createFriendStatusContainer(friendOptions) {
	const authorInfo = document.getElementById('profileInfo');
	if (friendOptions.length > 1) {
		const friendStatusContainer = document.createElement('div');
		friendStatusContainer.classList.add(
			'ml-auto',
			'flex',
			'items-end',
			'flex-col',
			'gap-2'
		);
		const acceptButtton = document.createElement('div');
		acceptButtton.innerText = 'Accept';
		acceptButtton.classList.add(
			'acceptFriend',
			'flex',
			'justify-center',
			'items-center',
			'text-white',
			'cursor-pointer',
			'bg-rose-300',
			'hover:bg-rose-500',
			'rounded',
			'w-36',
			'h-6'
		);
		const rejectButtton = document.createElement('div');
		rejectButtton.innerText = 'Reject';
		rejectButtton.classList.add(
			'rejectFriend',
			'flex',
			'justify-center',
			'items-center',
			'text-white',
			'cursor-pointer',
			'bg-emerald-300',
			'hover:bg-emerald-500',
			'rounded',
			'w-36',
			'h-6'
		);

		friendStatusContainer.appendChild(acceptButtton);
		friendStatusContainer.appendChild(rejectButtton);

		authorInfo.appendChild(friendStatusContainer);
	} else {
		const friendStatusContainer = document.createElement('div');
		friendStatusContainer.classList.add('ml-auto');

		if (friendOptions[0] == 'remove') {
			friendStatusContainer.innerText = 'Remove';
			friendStatusContainer.classList.add(
				'removeFriend',
				'cursor-pointer',
				'flex',
				'justify-center',
				'items-center',
				'bg-slate-300',
				'hover:bg-slate-400',
				'rounded',
				'w-36',
				'h-10'
			);
		} else if (friendOptions[0] == 'wait') {
			friendStatusContainer.innerText = 'Waiting approved';
			friendStatusContainer.classList.add(
				'flex',
				'justify-center',
				'items-center',
				'bg-slate-300',
				'rounded',
				'w-36',
				'h-10',
				'truncate'
			);
		} else {
			friendStatusContainer.innerText = 'Add friend';
			friendStatusContainer.classList.add(
				'addFriend',
				'cursor-pointer',
				'flex',
				'justify-center',
				'text-white',
				'items-center',
				'bg-rose-300',
				'hover:bg-rose-500',
				'rounded',
				'w-36',
				'h-10'
			);
		}

		authorInfo.appendChild(friendStatusContainer);
	}
}
