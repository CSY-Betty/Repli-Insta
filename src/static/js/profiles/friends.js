import { checkLogin } from '../auth/logStatus.js';
import { getRelationData } from './datafetch.js';

async function renderFriendRelate(relation) {
	const userId = await checkLogin();
	console.log(relation);
	console.log(userId);

	if ((userId.user_id === relation.sender) & (relation.status === 'send')) {
		return 'Waiting Approved';
	} else if (
		(userId.user_id === relation.receiver) &
		(relation.status === 'send')
	) {
		return 'check';
	}
}

async function renderFriendList() {
	const relationData = await getRelationData();
	console.log(relationData);
	const friendRelate = document.getElementById('friendRelate');

	for (const relation of relationData) {
		const friendContainer = document.createElement('div');
		friendContainer.classList.add(
			'friendContainer',
			'p-4',
			'my-4',
			'w-full',
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
			'basis-1/5',
			'rounded-full',
			'overflow-hidden'
		);
		friendAvatar.src = relation.counterpart_profile.avatar;

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
			relation.counterpart_profile.first_name +
			' ' +
			relation.counterpart_profile.last_name;

		let friendStatus;
		if (relation.status != 'accepted') {
			friendStatus = document.createElement('button');
			friendStatus.classList.add(
				'friendStatus',
				'basis-1/5',
				'bg-blue-500',
				'hover:bg-blue-700',
				'text-white',
				'font-bold',
				'py-2',
				'px-4',
				'rounded'
			);
			friendStatus.innerText = await renderFriendRelate(relation);
		}

		friendInfo.appendChild(friendName);

		friendContainer.appendChild(friendAvatar);
		friendContainer.appendChild(friendInfo);

		if (friendStatus) {
			friendContainer.appendChild(friendStatus);
		}

		friendRelate.appendChild(friendContainer);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	renderFriendList();
});
