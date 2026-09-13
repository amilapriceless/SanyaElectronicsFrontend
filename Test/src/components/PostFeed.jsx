import { PostCard } from "./PostCard";

export function PostFeed({ posts }) {
  return (
    <main className="feed">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}