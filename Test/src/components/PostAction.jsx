export function PostAction({ isLiked, likeCount, onToggleLike }) {
  return (
    <div className="post-action">
      <button 
        className={`like-btn ${isLiked ? "liked" : ""}`} 
        onClick={onToggleLike}
      >
        ♥
      </button>
      <span className="like-count">{likeCount}</span>
    </div>
  );
}