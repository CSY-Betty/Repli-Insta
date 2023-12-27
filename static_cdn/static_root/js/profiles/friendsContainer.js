export function createFriendsContainer(userId, friendsData) {
	const friendRelate = document.getElementById('friendRelate');

	friendRelate.classList.add('mr-48', 'ml-96');

	for (const friend of friendsData) {
		const friendOptions = createFriendsStatusContainer(userId, friend);

		const friendContainer = document.createElement('div');
		friendContainer.dataset.friendId = friend.counterpart_profile.user;
		friendContainer.dataset.slug = friend.counterpart_profile.slug;

		friendContainer.classList.add(
			'friendContainer',
			'p-4',
			'my-4',
			'w-3/4',
			'lg:max-w-full',
			'flex',
			'flex-row',
			'items-center',
			'border',
			'border-gray-400',
			'rounded'
		);

		const friendAvatar = document.createElement('img');
		friendAvatar.classList.add(
			'friendAvatar',
			'w-16',
			'h-16',
			'rounded-full',
			'overflow-hidden',
			'cursor-pointer'
		);
		friendAvatar.src = friend.counterpart_profile.avatar;

		const friendInfo = document.createElement('div');
		friendInfo.classList.add(
			'basis-3/5',
			'px-4',
			'flex',
			'flex-col',
			'justify-between',
			'leading-normal'
		);
		const friendName = document.createElement('div');
		friendName.classList.add(
			'friendName',
			'text-gray-900',
			'font-bold',
			'text-l',
			'mb-2'
		);
		friendName.innerText =
			friend.counterpart_profile.first_name +
			' ' +
			friend.counterpart_profile.last_name;

		friendInfo.appendChild(friendName);

		friendContainer.appendChild(friendAvatar);
		friendContainer.appendChild(friendInfo);

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
				'bg-slate-300',
				'hover:bg-slate-500',
				'rounded',
				'w-36',
				'h-6'
			);

			friendStatusContainer.appendChild(acceptButtton);
			friendStatusContainer.appendChild(rejectButtton);

			friendContainer.appendChild(friendStatusContainer);
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
					'truncate',
					'cursor-default'
				);
			} else {
				friendStatusContainer.innerText = 'Add friend';
				friendStatusContainer.classList.add(
					'addFriend',
					'cursor-pointer'
				);
			}

			friendContainer.appendChild(friendStatusContainer);
		}

		friendRelate.appendChild(friendContainer);
	}
}

function createFriendsStatusContainer(userId, friend) {
	if (friend.status === 'send') {
		if (userId === friend.receiver) {
			return ['accept', 'reject'];
		} else if (userId === friend.sender) {
			return ['wait'];
		}
	} else if (friend.status === 'accepted') {
		return ['remove'];
	}

	return ['add'];
}
