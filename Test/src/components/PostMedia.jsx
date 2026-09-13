export function PostMedia({ imageUrl, altText }) {
  return (
    <div className="post-media">
      <img src={imageUrl} alt={altText} loading="lazy" />
    </div>
  );
}