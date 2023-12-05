export function getFriendshipActionWithUser(userId, friendStatus) {
	const friendship = friendStatus.find(
		(friendship) =>
			friendship.sender === userId || friendship.receiver === userId
	);

	if (friendship) {
		if (friendship.status === 'send') {
			if (userId === friendship.receiver) {
				return ['accept', 'reject'];
			} else if (userId === friendship.sender) {
				return ['wait'];
			}
		} else if (friendship.status === 'accepted') {
			return ['remove'];
		}
	}

	return ['add'];
}
