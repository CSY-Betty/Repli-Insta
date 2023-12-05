export function timeCalculate(time) {
	const postDate = new Date(time);
	const now = new Date();

	const timeDiff = now - postDate;

	const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hoursDiff = Math.floor(
		(timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);

	if (daysDiff > 0) {
		return `${daysDiff} days ${hoursDiff} hours ago`;
	} else {
		return `${hoursDiff} hours ago`;
	}
}

export function checkPostLikeStatus(postData, user) {
	if (postData && postData.liked && Array.isArray(postData.liked)) {
		return postData.liked.includes(user.user_id);
	}
	return false;
}

export function getFriendshipActionWithAuthor(authorId, friendStatus) {
	const friendship = friendStatus.find(
		(friendship) =>
			friendship.sender === authorId || friendship.receiver === authorId
	);

	if (friendship) {
		if (friendship.status === 'send') {
			if (authorId === friendship.sender) {
				return ['accept', 'reject'];
			} else if (authorId === friendship.receiver) {
				return ['wait'];
			}
		} else if (friendship.status === 'accepted') {
			return ['remove'];
		}
	}

	return ['add'];
}
