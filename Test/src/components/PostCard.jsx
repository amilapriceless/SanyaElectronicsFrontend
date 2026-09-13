import { PostHeader } from "./PostHeader";
import { PostMedia } from "./PostMedia";
import { PostAction } from "./PostAction";
import { useLike } from "../hooks/useLike";

export function PostCard({ post }) {
  const { isLiked, count, toggleLike } = useLike(
    post.initialIsLiked,
    post.initialLikeCount
  );

  return (
    <article className="post-card">
      <PostHeader 
        avatar={post.avatar} 
        username={post.username} 
        date={post.date} 
      />
      <PostMedia 
        imageUrl={post.imageUrl} 
        altText={`Post by ${post.username}`} 
      />
      <PostAction 
        isLiked={isLiked} 
        likeCount={count} 
        onToggleLike={toggleLike} 
      />
    </article>
  );
}