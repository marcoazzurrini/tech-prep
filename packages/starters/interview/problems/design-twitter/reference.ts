import { Heap } from "./ds.ts";

type Post = { time: number; tweetId: number };
type Entry = Post & { user: number; index: number };

export class Twitter {
  private time = 0;
  private tweets = new Map<number, Post[]>(); // user -> posts, oldest first
  private following = new Map<number, Set<number>>();

  postTweet(userId: number, tweetId: number): void {
    const posts = this.tweets.get(userId) ?? [];
    posts.push({ time: ++this.time, tweetId });
    this.tweets.set(userId, posts);
  }

  getNewsFeed(userId: number): number[] {
    // Start with the newest tweet of the user and of each followed user.
    const heap = new Heap<Entry>((a, b) => b.time - a.time);
    for (const user of new Set([userId, ...(this.following.get(userId) ?? [])])) {
      const posts = this.tweets.get(user) ?? [];
      const index = posts.length - 1;
      if (index >= 0) heap.push({ ...posts[index], user, index });
    }

    const feed: number[] = [];
    while (heap.size > 0 && feed.length < 10) {
      // Take the newest tweet overall. Then offer that user's next older tweet.
      const { tweetId, user, index } = heap.pop()!;
      feed.push(tweetId);
      if (index > 0) heap.push({ ...this.tweets.get(user)![index - 1], user, index: index - 1 });
    }
    return feed;
  }

  follow(followerId: number, followeeId: number): void {
    const followed = this.following.get(followerId) ?? new Set<number>();
    followed.add(followeeId);
    this.following.set(followerId, followed);
  }

  unfollow(followerId: number, followeeId: number): void {
    this.following.get(followerId)?.delete(followeeId);
  }
}
