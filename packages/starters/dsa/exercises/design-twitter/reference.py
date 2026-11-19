import heapq


class Twitter:
    def __init__(self):
        self.time = 0
        self.tweets: dict[int, list[tuple[int, int]]] = {}  # user -> (time, tweetId), oldest first
        self.following: dict[int, set[int]] = {}

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.time += 1
        self.tweets.setdefault(userId, []).append((self.time, tweetId))

    def getNewsFeed(self, userId: int) -> list[int]:
        # Start with the newest tweet of the user and of each followed user.
        heap = []
        for user in self.following.get(userId, set()) | {userId}:
            posts = self.tweets.get(user, [])
            if posts:
                time, tweet_id = posts[-1]
                heap.append((-time, tweet_id, user, len(posts) - 1))
        heapq.heapify(heap)

        feed: list[int] = []
        while heap and len(feed) < 10:
            # Take the newest tweet overall. Then offer that user's next older tweet.
            _, tweet_id, user, index = heapq.heappop(heap)
            feed.append(tweet_id)
            if index > 0:
                time, older = self.tweets[user][index - 1]
                heapq.heappush(heap, (-time, older, user, index - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        self.following.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following.get(followerId, set()).discard(followeeId)
