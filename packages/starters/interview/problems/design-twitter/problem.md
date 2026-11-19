# Design Twitter (medium)

Implement a class `Twitter`, a small social feed. Users post tweets, follow other users, and read a news feed.
- `Twitter()`: creates an empty system.
- `postTweet(userId, tweetId)`: user `userId` posts a new tweet with the id `tweetId`. Every `tweetId` is used once.
- `getNewsFeed(userId)`: returns the ids of the 10 most recent tweets in the user's feed, newest first. The feed holds the user's own tweets and the tweets of everyone the user follows. If the feed has fewer than 10 tweets, return all of them.
- `follow(followerId, followeeId)`: user `followerId` starts to follow user `followeeId`.
- `unfollow(followerId, followeeId)`: user `followerId` stops following user `followeeId`. If they did not follow, nothing happens.

Example:
  ops  = ["Twitter", "postTweet", "getNewsFeed", "follow", "postTweet", "getNewsFeed", "unfollow", "getNewsFeed"]
  args = [[], [1, 5], [1], [1, 2], [2, 6], [1], [1, 2], [1]]
  ->     [null, null, [5], null, null, [6, 5], null, [5]]

Constraints: 1 <= userId, followerId, followeeId <= 500, 0 <= tweetId <= 10^4, followerId != followeeId, at most 3 * 10^4 calls.
Follow-up: each user's tweets are already in time order. Can you merge only the newest tweets with a heap, and not sort every tweet?
