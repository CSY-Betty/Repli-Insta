import { checkLogin } from '../auth/logStatus.js';
import { getRelationData } from './datafetch.js';

async function renderFriendRelate(relation) {
	const userId = await checkLogin();

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
			friendStatus = document.createElement('div');
			friendStatus.classList.add(
				'friendStatus',
				'basis-1/5',
				'flex',
				'flex-col',
				'gap-2'
			);
			const relatStatus = await renderFriendRelate(relation);
			if (relatStatus === 'Waiting Approved') {
				const waitApprove = document.createElement('div');
				waitApprove.innerText = relatStatus;
				waitApprove.classList.add(
					'bg-slate-300',
					'text-white',
					'font-bold',
					'py-2',
					'px-4',
					'rounded',
					'text-center'
				);
				friendStatus.appendChild(waitApprove);
			} else {
				const acceptButton = document.createElement('button');
				acceptButton.innerText = 'Accept';
				acceptButton.classList.add(
					'AcceptButton',
					'bg-green-500',
					'hover:bg-green-700',
					'text-white',
					'font-bold',
					'py-2',
					'px-4',
					'rounded'
				);
				acceptButton.dataset.profile =
					relation.counterpart_profile.user;

				const rejectButton = document.createElement('button');
				rejectButton.innerText = 'Reject';
				rejectButton.classList.add(
					'RejectButton',
					'bg-red-400',
					'hover:bg-red-700',
					'text-white',
					'font-bold',
					'py-2',
					'px-4',
					'rounded'
				);
				rejectButton.dataset.profile =
					relation.counterpart_profile.user;

				friendStatus.appendChild(acceptButton);
				friendStatus.appendChild(rejectButton);
			}
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
	updateFriend();
});

function updateFriend() {
	const friendRelate = document.getElementById('friendRelate');

	friendRelate.addEventListener('click', function (event) {
		if (
			event.target.matches('.AcceptButton') ||
			event.target.matches('.RejectButton')
		) {
			const profileId = event.target.getAttribute('data-profile');

			if (event.target.classList.contains('AcceptButton')) {
				accept(profileId);
			} else if (event.target.classList.contains('RejectButton')) {
				reject(profileId);
			}
		}
	});
}

async function accept(profileId) {
	const userId = await checkLogin();
	// 執行接受操作，使用 profileId
	console.log('Accept profile with ID:', profileId);

	const originUrl = window.location.origin;
	const url = '/profiles/profile/friends/accept/';

	const acceptFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		sender: profileId,
		receiver: userId.user_id,
		status: 'send',
	};

	fetch(acceptFriendUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => console.log('sucess: ', data))
		.catch(console.error());
}

async function reject(profileId) {
	// 執行拒絕操作，使用 profileId
	console.log('Reject profile with ID:', profileId);
	const userId = await checkLogin();

	const originUrl = window.location.origin;
	const url = `/profiles/profile/friends/reject/${profileId}`;

	const rejectFriendUrl = `${originUrl}${url}`;

	const csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0]
		.value;

	const data = {
		sender: profileId,
		receiver: userId.user_id,
		status: 'send',
	};

	fetch(rejectFriendUrl, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => console.log('sucess: ', data))
		.catch(console.error());
}
